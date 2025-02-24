import {Request} from "express";

import {IEmail, IResetPassword, IUser} from "./user.type";
import {ICategory} from "./category.type";
import {IAvailability, ICoach} from "./coach.type";
import {IMessage} from "./message.type";
import {ISession} from "./session.type";


declare module "express" {
    export interface Request {
        _id: string;
        user:IUser;
        category:ICategory;
        email:IEmail;
        availability:IAvailability;
        resetData:IResetPassword;
        coach:ICoach;
        message:IMessage;
        session:ISession;
    }
}
