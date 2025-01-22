import { Request, Response } from "express";

// --------------- IMPORTING OTHER FILES ---------------
import { Order } from "../models/order.model";
import { notifyOrderUpdate } from "../utilities/socket";
import { Restaurant } from "../models/restaurant.model";
import { getPagination } from "../utilities/pagination";
import ResponseHandler from '../utilities/responseHandler';
import StatusCodeUtility from '../utilities/statusCodeUtility';
import uploadImageOnCloudinary from "../utilities/imageToCloudinary";
import { sendWhatsAppMessage, sendWhatsAppImageMessage} from '../utilities/sendWhatsAppMessage';

// --------------- API FOR CREATING A RESTAURANT ---------------
export const createRestaurant = async (req: Request, res: Response) => {
    try {
        const {restaurantName, city,country,deliveryTime, cuisines} = req.body;
       
        const file = req.file;
        const restaurant = await Restaurant.findOne({user:req.id});
        if(restaurant){
            return ResponseHandler({ statusCode: StatusCodeUtility.Conflict, message: "Restaurant already exists", data: null, response: res });
        }
        if(!file){
            return ResponseHandler({ statusCode: StatusCodeUtility.BadRequest, message: "Please upload an image", data: null, response: res });
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines),
            imageUrl
        })

        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Restaurant created successfully", data: null, response: res });
    
    } catch (error) {
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}

// --------------- API FOR GETTING RESTAURANT ---------------
export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate('menus');
        if (!restaurant) {
            return ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Restaurant not found", data: null, response: res });
        }

        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Restaurant found", data: { restaurant }, response: res });
    
    } catch (error) {
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}

// --------------- API FOR UPDATING DETAILS OF A RESTAURANT ---------------
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Restaurant not found", data: null, response: res });
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);
        
        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Restaurant updated successfully", data: null, response: res });
    
    } catch (error) {
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}
    // --------------- API FOR GETTING DETAILS OF ORDERS OF A RESTAURANT ---------------
    export const getRestaurantOrder = async (req: Request, res: Response) => {
        try {
            const restaurant = await Restaurant.findOne({ user: req.id });
            if (!restaurant) {
                ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Restaurant not found", data: null, response: res });
            };
            const totalOrders = await Order.countDocuments({ restaurant: restaurant!._id });
            const { skip, limit, page, totalPages, totalItems } = getPagination(req, totalOrders,2);

            const orders = await Order.find({ restaurant: restaurant!._id }).populate('restaurant').populate('user').
            skip(skip).limit(limit).exec();
            return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Orders found", data: { orders, pagination: {
                currentPage: page,
                totalPages,
                totalOrders: totalItems,
            }, }, response: res });
        
        } catch (error) {
            console.log(error);
            return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
        }
    }

// --------------- API FOR UPDATING ORDER STATUS ---------------
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId).populate('user');
        if (!order) {
           return ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Order not found", data: null, response: res });
        }
        order.status = status;
        await order.save();
        const userPhone: string = (order.user as any).contact; 
        console.log(userPhone);
    const userName: string = (order.user as any).fullname;
    const message = `Hi ${userName}, your order with ID ${orderId} has been updated to "${status}". Thank you for shopping with us!`;
    await sendWhatsAppMessage(userPhone, message);
    await sendWhatsAppImageMessage(userPhone);

    notifyOrderUpdate(order);
    
    return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Order status updated successfully", data: null, response: res });

    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}

// --------------- API FOR GETTING DETAILS BASED ON SEARCH/FILTER ---------------
export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        const query: any = {};
        
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ]
        }
        if (searchQuery) {
            query.$or = [
                { restaurantName: { $regex: searchQuery, $options: 'i' } },
                { cuisines: { $regex: searchQuery, $options: 'i' } }
            ]
        }
        if(selectedCuisines.length > 0){
            query.cuisines = {$in:selectedCuisines}
        }
        
        const restaurants = await Restaurant.find(query);
        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Restaurants found", data: { restaurants }, response: res });

    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}

// --------------- API FOR GETTING DETAILS OF SINGLE RESTAURANT ---------------
export const getSingleRestaurant = async (req:Request, res:Response) => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path:'menus',
            options:{createdAt:-1}
        });
        if(!restaurant){
            return ResponseHandler({statusCode: StatusCodeUtility.NotFound, message: "Restaurant not found", data:null ,response: res });
        };
        return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "Restaurant found", data:{restaurant} ,response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR GETTING ALL RESTAURANT ---------------
export const getAllRestaurants = async (req:Request, res:Response) => {
    try {
        const restaurants = await Restaurant.find();
        return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "Restaurants found", data:{restaurants} ,response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}