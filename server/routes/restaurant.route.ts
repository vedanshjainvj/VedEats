import express from 'express';

// --------------- IMPORTING OTHER FILES ---------------
import upload from '../middlewares/multer';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { createRestaurant, getRestaurant, getRestaurantOrder, updateOrderStatus, getAllRestaurants, updateRestaurant, searchRestaurant, getSingleRestaurant } from '../controllers/restaurant.controller';

const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("imageFile"), createRestaurant);
router.route("/").get(isAuthenticated, getRestaurant);
router.route("/get-all").get(isAuthenticated, getAllRestaurants);
router.route("/").put(isAuthenticated, upload.single("imageFile"), updateRestaurant);
router.route("/order").get(isAuthenticated,  getRestaurantOrder);
router.route("/order/:orderId/status").put(isAuthenticated, updateOrderStatus);
router.route("/search/:searchText").get(isAuthenticated, searchRestaurant);
router.route("/:id").get(isAuthenticated, getSingleRestaurant);

export default router;