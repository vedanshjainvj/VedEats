import Stripe from "stripe";
import { Request, Response } from "express";

// --------------- IMPORTING OTHER FILES ---------------
import { Order } from "../models/order.model";
import { stripe } from "../config/stripe.config";
import { Restaurant } from "../models/restaurant.model"; 
import ResponseHandler from '../utilities/responseHandler';
import StatusCodeUtility from '../utilities/statusCodeUtility';

type CheckoutSessionRequest = {
    cartItems: {
        menuId: string;
        name: string;
        // image: string;
        price: number;
        quantity: number
    }[],
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string
    },
    restaurantId: string
}

export const getOrders = async (req: Request, res: Response) => {
    try {
        const orders = (await Order.find({ user: req.id }).populate('user').populate('restaurant')).reverse();
        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Orders found", data: { orders }, response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
        if (!restaurant) {
            return ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Restaurant not found", data: null, response: res });
        };
        const order: any = new Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "pending"
        });

        // line items
        const menuItems = restaurant.menus;
        const lineItems = createLineItems(checkoutSessionRequest, menuItems);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB', 'US', 'CA']
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/order/status?orderId=${order._id.toString()}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart`,
            metadata: {
                orderId: order._id.toString(),
                // images: JSON.stringify(menuItems.map((item: any) => item.image))
            }
        });
        if (!session.url) {
            return ResponseHandler({ statusCode: StatusCodeUtility.BadRequest, message: "Error creating checkout session", data: null, response: res });
        }
        await order.save();
        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Checkout session created", data: { url: session.url }, response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });

    }
}

export const stripeWebhook = async (req: Request, res: Response) => {
    let event;

    try {
        const signature = req.headers["stripe-signature"];

        // Construct the payload string for verification
        const payloadString = JSON.stringify(req.body, null, 2);
        const secret = process.env.WEBHOOK_ENDPOINT_SECRET!;

        // Generate test header string for event construction
        const header = stripe.webhooks.generateTestHeaderString({
            payload: payloadString,
            secret,
        });

        // Construct the event using the payload string and header
        event = stripe.webhooks.constructEvent(payloadString, header, secret);
    } catch (error: any) {
        console.error('Webhook error:', error.message);
        return ResponseHandler({ statusCode: StatusCodeUtility.BadRequest, message: "Webhook error", data: null, response: res });
    }

    // Handle the checkout session completed event
    if (event.type === "checkout.session.completed") {
        try {
            const session = event.data.object as Stripe.Checkout.Session;
            const order = await Order.findById(session.metadata?.orderId);

            if (!order) {
                return ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Order not found", data: null, response: res });
            }
            console.log(session)
            // Update the order with the amount and status
            if (session.amount_total) {
                order.totalAmount = session.amount_total;
            }
            order.status = "confirmed";
            order.paymentId = session.payment_intent as string; // Assuming payment_intent contains the payment ID
        order.paymentMode = session.payment_method_types?.[0]; // e.g., 'card'
        order.paidAt = new Date(); // Current timestamp as paid date

            await order.save();
        } catch (error) {
            console.error('Error handling event:', error);
            return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Error handling event", data: null, response: res });
        }
    }
    // Send a 200 response to acknowledge receipt of the event
    ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Webhook received", data: null, response: res });
};

export const createLineItems = (checkoutSessionRequest: CheckoutSessionRequest, menuItems: any) => {
    // 1. create line items
    const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
        const menuItem = menuItems.find((item: any) => item._id.toString() === cartItem.menuId);
        if (!menuItem) throw new Error(`Menu item id not found`);

        return {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: menuItem.name,
                    // images: [menuItem.image],
                },
                unit_amount: menuItem.price * 100
            },
            quantity: cartItem.quantity,
        }
    })
    // 2. return lineItems
    return lineItems;
}

export const fetchOrderDetails = async (req: Request, res: Response) => {
    try {
        const orderId = req.params.orderId;
        const order = await Order.findById(orderId).populate('user').populate('restaurant');
        if (!order) {
            return ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Order not found", data: null, response: res });
        }
        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Order found", data: { order }, response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
};
