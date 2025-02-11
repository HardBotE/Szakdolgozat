import catchAsync from "../Utils/CatchAsyncError";
import UserModel from "../Model/userModel";
import {NextFunction,Request,Response} from "express";
import {jwt} from "jsonwebtoken"

interface SignUpBody {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
}

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

    res.status(200).json({
        status: "success",
        data: {
            user: newUser
        }
    });

});

const signToken=(id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES});
}

const createJWT=(user,statusCode:number,res)=>{

    const token=signToken(user._id);

    const cookieSettings={
        expires:new Date(Date.now() + process.env.JWT_EXPIRES+24*60*60*1000),
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

    if(!user ||! await user.isPasswordCorrect(password,user.password)){
        return next(new Error("Passwords don't match"));
    }

    createJWT(user,200,res);
});