import mongoose, {Model} from "mongoose";
import crypto from 'crypto';
import bcrypt from 'bcrypt';
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
        default:'client',
    },
    sub_type:{
        type:String,
        required:true,
        enum:['normal','premium'],
        default:'normal',
    }
    },{
        toJSON:{virtuals:true},
        toObject:{virtuals:true},
    }
);

/*
*validatorok
* */

schema.pre('save',async function (next){
    this.password=await bcrypt.hash(this.password, 12);
});

schema.methods.isPasswordCorrect=function(candidatePassword:string,hashedPassword:string){

    return bcrypt.compare(candidatePassword,hashedPassword);

};

const userModel:Model<IUser>=mongoose.model<IUser>('User',schema);

export default userModel;