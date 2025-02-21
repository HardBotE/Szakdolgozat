import mongoose from "mongoose";

interface IUser extends Document {
    _id:mongoose.Types.ObjectId;
    id?:string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "client" | "coach";
    sub_type:'normal'|'premium';
    isPasswordCorrect:(candidatePassword: string,userPassword:string) => Promise<boolean>;
}

export  {IUser};