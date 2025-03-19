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
    },
    password_resetToken:{
        type:{
            token:{
                type:String,

            },
            availableUntil:{
                type:Date,
            }
        },
        required:false,
        hidden:true,
    },
    picture:{
        type:String,
        default:'public/profile_pictures/default_profile.png'
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

schema.methods.generateResetTokens=async function (){

    const resetToken=crypto.randomBytes(32).toString('hex');

    if (!this.password_resetToken) {
        this.password_resetToken = { token: "", availableUntil: new Date() };
    }

    this.password_resetToken.token=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.password_resetToken.availableUntil=Date.now()+10*60*100000;

    return resetToken;
}

schema.methods.hashAfterNewPassword=async function (password:string){
    return await bcrypt.hash(password, 12);
}

schema.methods.isPasswordResetToken=function(token:string){
    return (token===this.password_resetToken.token);
}
schema.methods.isPasswordCorrect=async function (candidatePassword: string, hashedPassword: string) {

    return await bcrypt.compare(candidatePassword, hashedPassword);

};

const userModel:Model<IUser>=mongoose.model<IUser>('User',schema);

export default userModel;