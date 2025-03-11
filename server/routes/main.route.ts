import express from 'express';

// --------------- IMPORTING OTHER ROUTES ---------------
import userRoutes from './user.route';
import menuRoutes from './menu.route';
import orderRoutes from './order.route';
import restaurantRoutes from './restaurant.route';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/menu', menuRoutes);
router.use('/order', orderRoutes);
router.use('/restaurant', restaurantRoutes);

export default router;

