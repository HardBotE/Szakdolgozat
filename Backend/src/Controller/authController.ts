import catchAsync from "../Utils/CatchAsyncError";
import UserModel from "../Model/userModel";
import {NextFunction, Request, RequestHandler, Response} from "express";
import jwt from 'jsonwebtoken';

import {AppError} from "../Utils/AppError";
import mongoose from "mongoose";
import sendEmail from "../Email/mailer";
import {Email, SignUpBody} from "../Types/user.type";
import crypto from "crypto";

const signUpUser = catchAsync(async (req:Request, res:Response,next:NextFunction) => {

    const {name,email,password,passwordConfirm} = req.body as unknown as SignUpBody;

    if(password !== passwordConfirm){
        return next(new Error("Passwords don't match"));
    }

    const newUser=await UserModel.create({
        name,
        email,
        password,

    });

    //majd ide jon az email
    const autoEmail:Email={
        email:"admin@io",
        name:"Automatic-email"
    };
    await (sendEmail(autoEmail, <Email>{
        email: newUser.email,
        name: newUser.name
    }, 'Register', 'Congratulations you`re now successfully registered!'));

    res.status(200).json({
        status: "success",
        data: {
            user: newUser
        }
    });

});

const signToken=(id:string)=>{

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }
    return jwt.sign({id}, process.env.JWT_SECRET as string,<jwt.SignOptions>{expiresIn: process.env.JWT_EXPIRES ||"1h"});
}

const createJWT=(user,statusCode:number,res:Response)=>{

    const token=signToken(user._id);

    const cookieSettings={
        expires:new Date(Date.now() + (Number(process.env.JWT_EXPIRES_COOKIE) ||1) +24*60*60*1000),
        httpOnly:true,
    };

    res.cookie('jwt',token,cookieSettings);

    res.status(statusCode).json({
        message:'Successfully logged in',
        token,
        data:{
            user
        },
        status:'success'
    });
};

const loginUser=catchAsync(async (req:Request,res:Response,next:NextFunction) => {

    const {email,password}=req.body;

    if(!email || !password){
        return next(new Error("Email and password is required!"));
    }

    const user=await UserModel.findOne({email}).select("+password");
    console.log(password);
    console.log(user.password);
    if(!user ||! await user.isPasswordCorrect(password,user.password)){
        return next(new Error("Passwords don't match"));
    }

    createJWT(user,200,res);
});

const grantPermission=(...roles:string[])=>( req:Request,res:Response,next:NextFunction) => {
    if(!req.user)
    {
        next(new Error("You are not logged in"));
    }

    if(!roles.includes(req.user.role)){
        return next(new AppError('Unauthorized',403,'Users role is not in the permitted roles!'))
    }
    console.log(roles);
    next();
}

const getUserFromJWT: RequestHandler = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("Function called");

    try {
        const token = req.cookies.jwt;
        if (!token) {
            console.log("No token found");
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as jwt.JwtPayload;

        console.log("Decoded token:", decoded);

        if (!decoded.id) {
            console.log("Invalid token structure");
            return res.status(400).json({ message: "Invalid token structure" });
        }

        const userId=new mongoose.Types.ObjectId(decoded.id);

        const user=await UserModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user=user;
        req.user._id = user._id;
        res.locals.user = user;
        console.log('User found: '+req.user);
        return next();
    } catch (err) {
        console.log("Error in getUserFromJWT:", err);
        return next(err);
    }
});

const verifyOwnership = (field: "user_id" | "coach_id" | "sender_id" | "id") => {
    return (req: Request, res: Response, next: NextFunction) => {
        if(req.user.role==='admin')
            next();

        //ha modositani szeretnenk a user_id/t vagy a coachid-t bodyban vagy req.paramsban
        if (req.body[field] || req.params[field]) {
            const paramId=req.params[field]? new mongoose.Types.ObjectId(req.params[field]) : null;
            const bodyId=req.body[field]? new mongoose.Types.ObjectId(req.body[field]) : null;
            const userId=new mongoose.Types.ObjectId(req.user._id);

            if (bodyId && !bodyId.equals(userId)) {
                return next(new AppError("You can only modify your own messages, reservations!", 403, "Unauthorized action"));
            }
            if (paramId && !paramId.equals(userId)) {
                return next(new AppError("You can only modify your own messages, reservations!", 403, "Unauthorized action"));
            }

        }

        next();
    };
};

const passwordReset=catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const user=await UserModel.findOne({_id:req.user._id}).select("+password");

    if (!user) {
        return next(new AppError("User not found!", 404, "Please try again or contact support"));
    }

    if(!await req.user.isPasswordCorrect(req.body.password, user.password)) {
        return next(new AppError('Password is not correct!',403,'Enter the correct password'));
    }

    if(req.body.new_password !== req.body.passwordConfirm) {
        return next(new AppError('Passwords don\'t match!',400,'Enter identical passwords for new_password and passwordConfirm'))
    }

    const hashedPassword:string= await user.hashAfterNewPassword(req.body.new_password);

    if(!hashedPassword){
        return next(new AppError('Error ocurred while hasing the password!',500,'Try again later!'));
    }

    user.password=hashedPassword;
    await user.save();

    res.status(200).json({
        message:'Successfully changed password!'
    });
    
})

const passwordResetWithToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword,passwordConfirm } = req.body;

    if (!token || !newPassword) {
        return next(new AppError('Token and new password are required', 400, 'Please provide both.'));
    }

    const user = await UserModel.findOne({
        "password_resetToken.token": crypto.createHash('sha256').update(token).digest('hex'),
        "password_resetToken.availableUntil": { $gt: Date.now()}});

    if (!user) {
        return next(new AppError('Invalid or expired token', 400, 'Please request a new reset link.'));
    }

    if(newPassword !== passwordConfirm) {
        return next(new AppError("Passwords don\'t match",404,'Please provide identical passwords for new_password and passwordConfirm'));
    }

    user.password = await user.hashAfterNewPassword(newPassword);

    await user.updateOne({password:user.password});

    res.status(200).json({
        status: 'success',
        message: 'Password has been successfully reset. You can now log in with your new password.'
    });
});

const generateResetToken=catchAsync(async (req:Request,res:Response,next:NextFunction)=>{
    console.log('Generate reset token');
    const user=await UserModel.findOne(req.user._id);

    if(!user) {
        return next(new AppError('No user found',403,'Please try again or contact support'));
    }

    const resetToken=await user.generateResetTokens();

    await user.save({validateBeforeSave:true});

    await sendEmail({email: "admin@io", name: 'Admin'}, {
        email: req.user.email,
        name: req.user.name
    }, 'Password Reset token', resetToken);


    res.status(200).json({
        status:'success',
        message:'Successfully reset token to your email'
    })

})

export {loginUser,signUpUser,grantPermission,getUserFromJWT,verifyOwnership,passwordReset,generateResetToken,passwordResetWithToken};