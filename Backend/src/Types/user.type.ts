import mongoose from "mongoose";
import UserModel from "../Model/userModel";

interface IUser extends Document {
    _id:mongoose.Types.ObjectId;
    id?:string;
    name: string;
    email: string;
    password: string;
    picture: string;
    role: "admin" | "client" | "coach";
    sub_type:'normal'|'premium';
    password_resetToken:{
        type:{
            token:String,
            availableUntil:Date,
        }
    }
    generateResetTokens:()=>Promise<string>;
    isPasswordCorrect:(candidatePassword: string,userPassword:string) => Promise<boolean>;
    hashAfterNewPassword:(new_password:string) => Promise<string>;
}

interface IResetPassword extends Document {
    password:string;
    new_password:string;
    passwordConfirm:string;

}
interface IEmail extends Document {
    email:string;
    name:string;
}
interface SignUpBody {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

interface Email{
    name: string;
    email: string;
}

export  {IUser,IResetPassword,IEmail,SignUpBody,Email};