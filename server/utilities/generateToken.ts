import jwt from 'jsonwebtoken';
import { Response } from 'express';

// --------------- Importing Other Files ---------------
import { IUserDocument } from '../models/user.model';

export const generateToken = (user:IUserDocument, res:Response) => {
    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET!, {expiresIn: '5d'});
    res.cookie('token', token, {expires: new Date(Date.now() + 86400000), httpOnly: true});
    return token;
}