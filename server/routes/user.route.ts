import express from 'express';

// --------------- IMPORTING OTHER ROUTES ---------------
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { signup, login, forgotPassword, resetPassword, verifyEmail, logout, updateProfile, checkAuth } from '../controllers/user.controller';    

const router = express.Router();

router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);   
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-email").post(verifyEmail);
router.route("/reset-password/:token").post(resetPassword);
router.route("/profile/update").put(isAuthenticated, updateProfile);

export default router;

