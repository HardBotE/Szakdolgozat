import {Request} from "express";

import {IEmail, IResetPassword, IUser} from "./user.type";
import {ICategory} from "./category.type";
import {ICoach} from "./coach.type";
import {IMessage} from "./message.type";
import {ISession} from "./session.type";
import IAvailability from "./availability.type";


declare module "express" {
    export interface Request {
        _id: string;
        user:IUser;
        price:number;
        profile:string;
        background:string;
        session_files:string;
        category:ICategory;
        email:IEmail;
        uploadedData:string;
        naming:string;
        type:string;
        paymentId:string;
        availability:IAvailability;
        resetData:IResetPassword;
        coach:ICoach;
        message:IMessage;
        session:ISession;
    }
}
