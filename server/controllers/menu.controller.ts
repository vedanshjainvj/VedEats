import mongoose from "mongoose";
import { Request, Response } from "express";

// --------------- IMPORTING OTHER FILES ---------------
import { Menu } from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import ResponseHandler from '../utilities/responseHandler';
import StatusCodeUtility from '../utilities/statusCodeUtility';
import uploadImageOnCloudinary from "../utilities/imageToCloudinary";

// --------------- API FOR ADDING A NEW MENU ---------------
export const addMenu = async (req:Request, res:Response) => {
    try {
        const {name, description, price} = req.body;
        const file = req.file;
        if(!file){
            return ResponseHandler({ statusCode: StatusCodeUtility.BadRequest, message: "Please upload an image", data: null, response: res });
        };
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu: any = await Menu.create({
            name , 
            description,
            price,
            image:imageUrl
        });
        const restaurant = await Restaurant.findOne({user:req.id});
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            await restaurant.save();
        }

        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Menu added successfully", data: { menu }, response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}

// --------------- API FOR EDITING A MENU ---------------
export const editMenu = async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const {name, description, price} = req.body;
        const file = req.file;
        const menu = await Menu.findById(id);
        if(!menu){
            return ResponseHandler({ statusCode: StatusCodeUtility.NotFound, message: "Menu not found", data: null, response: res });
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;

        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();

        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Menu updated successfully", data: { menu }, response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}

// --------------- API TO DISPLAY ALL MENU ITEMS ---------------
export const getAllMenus = async (req:Request, res:Response) => {
    try {
        const menus = await Menu.find();
        return ResponseHandler({ statusCode: StatusCodeUtility.Success, message: "Menus found", data: { menus }, response: res });
    } catch (error) {
        console.log(error);
        return ResponseHandler({ statusCode: StatusCodeUtility.InternalServerError, message: "Internal Server Error", data: null, response: res });
    }
}