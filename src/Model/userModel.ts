import mongoose, {Model} from "mongoose";
import {IUser} from "../Types/user.type";
const schema=new mongoose.Schema<IUser>
(
    {
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        match:/^\w+@\w+\.\w+$/


    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','client','coach'],
        required:true,
    }}
);

/*
*validatorok
* */

const userModel:Model<IUser>=mongoose.model<IUser>('User',schema);

export default userModel;