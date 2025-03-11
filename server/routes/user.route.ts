import express from 'express';

// --------------- IMPORTING OTHER ROUTES ---------------
import { isAuthenticated } from '../middlewares/isAuthenticated';
import { signup, login, forgotPassword, resetPassword, verifyEmail, logout, updateProfile, checkAuth } from '../controllers/user.controller';    

const router = express.Router();

router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/signup").post(signup);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/profile/update").put(isAuthenticated, updateProfile);

export default router;

