import express from "express"

// --------------- IMPORTING OTHER ROUTES ---------------
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createCheckoutSession, getOrders, stripeWebhook, fetchOrderDetails } from "../controllers/order.controller";

const router = express.Router();

router.route("/").get(isAuthenticated, getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/fetch-order-details/:orderId").get(isAuthenticated, fetchOrderDetails);
router.route("/webhook").post(express.raw({type: 'application/json'}), stripeWebhook);

export default router;