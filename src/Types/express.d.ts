import {Request} from "express";

import {IUser} from "./user.type";
import {ICategory} from "./category.type";
import {ICoach} from "./coach.type";
import {IMessage} from "./message.type";
import {ISession} from "./session.type";


declare module "express" {
    export interface Request {
        _id: string;
        user:IUser;
        category:ICategory;
        coach:ICoach;
        message:IMessage;
        session:ISession;
    }
}
