import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { Request,Response } from 'express';

// --------------- IMPORTING OTHER FILES ---------------
import { User } from '../models/user.model';
import cloudinary from '../config/cloudinary.config';
import ResponseHandler from '../utilities/responseHandler';
import { generateToken } from '../utilities/generateToken';
import StatusCodeUtility from '../utilities/statusCodeUtility';
import { generateVerificationCode } from '../utilities/generateVerificationCode';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from '../utilities/email';

// --------------- API FOR REGISTERING NEW USER ---------------
export const signup = async (req:Request, res:Response) => {
    try {
        const {fullname,email,password,contact} = req.body;
        let user = await User.findOne({email});

        if(user){
            return ResponseHandler({statusCode: StatusCodeUtility.Conflict, message: "User already exists", data:null ,response: res });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode();

        user = await User.create({fullname,email,password:hashedPassword,contact,
        verificationToken, verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000});
            
        generateToken(user,res);
        await sendVerificationEmail(email,verificationToken);

        const userWithoutPassword = await User.findOne({email}).select('-password');
        return ResponseHandler({statusCode: StatusCodeUtility.Created, message: "User created successfully", data:{user:userWithoutPassword} ,response: res });
      
    } catch (error) {
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR LOGGING THE USER ---------------
export const login = async (req:Request, res:Response) => {
    try {
        const {email,password} = req.body;
        let user = await User.findOne({email});
        if(!user){
            return ResponseHandler({statusCode: StatusCodeUtility.NotFound, message: "User not found", data:null ,response: res });
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return ResponseHandler({statusCode: StatusCodeUtility.BadRequest, message: "Invalid credentials", data:null ,response: res });
        }
        generateToken(user,res);
        user.lastLogin = new Date();
        await user.save();
        const userWithoutPassword = await User.findOne({ email }).select('-password');

        return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "Login successful", data:{user:userWithoutPassword} ,response: res });
    
    } catch (error) {
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR VERIFYING 6 DIGIT OTP SENT ON MAIL ---------------
export const verifyEmail = async (req:Request, res:Response) => {
    try {
        const {verificationCode} = req.body;
        let user = await User.findOne({verificationToken:verificationCode,
            verificationTokenExpiresAt: {$gt: Date.now()}}).select('-password');

        if(!user){
            return ResponseHandler({statusCode: StatusCodeUtility.BadRequest, message: "Invalid verification token", data:null ,response: res });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email,user.fullname);

        return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "Email verified successfully", data:user ,response: res });
    
    } catch (error) {
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR LOGGING OUT THE USER ---------------
export const logout = async (req:Request, res:Response) => {
    try {
        res.clearCookie('token');
        return ResponseHandler({ statusCode: StatusCodeUtility.Success,message: "Logged out successfully",data: null,response: res })
    } catch (error) {
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR SENDING RESET LINK TO MANAGE PASSWORD ---------------
export const forgotPassword = async (req:Request, res:Response) => {
    try {
        const {email} = req.body;
        let user = await User.findOne({email}).select('-password');
        if(!user){
            return ResponseHandler({statusCode: StatusCodeUtility.NotFound, message: "User not found", data:null ,response: res });
        }
        const resetToken = crypto.randomBytes(40).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000);
        await user.save();

        let resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        await sendPasswordResetEmail(email,resetURL);

        return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "Reset password token sent to email", data:null ,response: res });
    
    } catch (error) {
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR RESETING THE PASSWORD ---------------
export const resetPassword = async (req:Request, res:Response) => {
    try {
        const {token} = req.params;
        const {newPassword} = req.body;
        let user = await User.findOne({resetPasswordToken:token,resetPasswordTokenExpiresAt: {$gt: Date.now()}});
        if(!user){
            return ResponseHandler({statusCode: StatusCodeUtility.BadRequest, message: "Invalid reset token", data:null ,response: res });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();
        await sendResetSuccessEmail(user.email);

        return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "Password reset successfully", data:null ,response: res });
    
    } catch (error) {
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR CHECKING AUTHENTICATION ---------------
export const checkAuth = async (req:Request, res:Response) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select('-password');
        if(!user){
            return ResponseHandler({statusCode: StatusCodeUtility.NotFound, message: "User not found", data:null ,response: res });
        }
        
        return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "User authenticated", data:{user} ,response: res });
    
    } catch (error) {
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}

// --------------- API FOR UPDATING USER PROFILE ---------------
export const updateProfile = async (req:Request, res:Response) => {
    try {
        const userId = req.id;
        const {fullname,email,contact,city,country,profilePicture} = req.body;

        let cloudResponse:any;
        try {
            cloudResponse = await cloudinary.uploader.upload(profilePicture);
            const updatedData = {fullname,email,contact,city,country,profilePicture:cloudResponse.secure_url};
            const user = await User.findByIdAndUpdate(userId,updatedData,{new:true}).select('-password');
            return ResponseHandler({statusCode: StatusCodeUtility.Success, message: "Profile updated successfully", data:{user} ,response: res });
        }
        catch (error) {
            return ResponseHandler({statusCode: StatusCodeUtility.BadRequest, message: "Invalid image", data:null ,response: res });
        }
    }
    catch (error){
        return ResponseHandler({statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data:null ,response: res });
    }
}