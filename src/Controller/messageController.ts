import messageModel from "../Model/messageModel";
import { deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";
import catchAsync from "../Utils/CatchAsyncError";
import {NextFunction, Request, Response} from "express";
import {AppError} from "../Utils/AppError";


const createMessage= catchAsync(async function(req:Request,res:Response,next:NextFunction){
    {
        console.log(req.params);
        const client_id=req.params.id;
        if (!client_id) {
            return next(new AppError('Category ID is required', 400, 'Please provide a valid category ID'));
        }


        const sender_id=req.user.id;
        if (!sender_id) {
            return next(new AppError('You need to log in to your account', 400));
        }

        const input={
            sender_id,
            client_id,
            ...req.body,
        };
        console.log(input);

        const data= await messageModel.create(input);

        if(!data) {
            return next(new AppError('Error occurred while creating coach',404,'Please make sure that the entered data is correct'));
        }


        console.log(data);
        res.status(200).json({
            data,
            message:'Successfully sent message',
        })

    }

})

const findAllMessages=findAll(messageModel);

const findOneMessage=findOneById(messageModel);

const updateMessage=updateOneById(messageModel,['id','_id','sender_id','timestamp']);

const deleteMessage=deleteOneById(messageModel);

export {createMessage,findAllMessages,findOneMessage,updateMessage,deleteMessage};