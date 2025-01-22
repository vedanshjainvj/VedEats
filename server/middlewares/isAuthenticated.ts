import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

// --------------- IMPORTING OTHER FILES ---------------
import ResponseHandler from "../utilities/responseHandler";
import StatusCodeUtility from "../utilities/statusCodeUtility";

dotenv.config()

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return ResponseHandler({statusCode: StatusCodeUtility.Unauthorized, message: "Unauthorized", data: null, response: res});
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        if(!decode) {
            return ResponseHandler({statusCode: StatusCodeUtility.Unauthorized, message: "Unauthorized", data: null, response: res});
        }   
        
        req.id = decode.userId;
        next();
    }
    catch(error) {
        return ResponseHandler({statusCode: StatusCodeUtility.Unauthorized, message: "Unauthorized", data: null, response: res});
    }
   
}