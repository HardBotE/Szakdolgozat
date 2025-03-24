import messageModel from "../Model/messageModel";
import MessageModel from "../Model/messageModel";
import {deleteOneById, updateOneById} from "./FactoryController";
import catchAsync from "../Utils/CatchAsyncError";
import {NextFunction, Request, Response} from "express";
import {AppError} from "../Utils/AppError";
import mongoose from "mongoose";
import userModel from "../Model/userModel";
import UserModel from "../Model/userModel";


const createMessage =  async function (receiver_id: string, sender_id: string, message: string) {

    const receiver_name=await UserModel.findOne({_id:receiver_id});
    console.log(receiver_name);
    if (!message)
        return;

    let conversation = await MessageModel.findOne({users: {$all: [sender_id, receiver_id]}});

    if (!conversation) {

        conversation = await MessageModel.create({
            users: [sender_id, receiver_id],
            messages: [{sender: sender_id, message}]
        });
    } else {

        conversation = await MessageModel.findOneAndUpdate(
            {users: {$all: [sender_id, receiver_id]}},
            {$push: {messages: {sender: sender_id, text:message,sender_name:receiver_name.name}}},
            {new: true}
        );
        await conversation.save();
    }

    return conversation;
};

const createMessageSession = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    console.log(req.params);

    const receiver_id = new mongoose.Types.ObjectId(req.body.id);
    const sender_id = new mongoose.Types.ObjectId(req.user.id);

    if (!receiver_id) {
        return next(new AppError('Receiver ID is required', 400, 'Please provide a valid user ID'));
    }

    if (!sender_id) {
        return next(new AppError('You need to log in to send messages', 401));
    }

    let conversation = await MessageModel.findOne({ users: { $all: [sender_id, receiver_id] } });

    if (!conversation) {
        conversation = await MessageModel.create({ users: [sender_id, receiver_id], messages: [] });
    }

    res.status(200).json({
        success: true,
        message: "Message session created successfully",
        data: conversation,
    });
});

export const findAllMessageSessionsWS = async (userId: string) => {
    try {
        return await MessageModel.find({users: {$in:[new mongoose.Types.ObjectId(userId)]}}).select('-messages');
    } catch (error) {
        console.error("❌ Hiba az üzenetek lekérésekor:", error);
        return [];
    }
};

const findOneMessageSession=(async function (reciever_id,sender_id){

    const userSession = await MessageModel.findOne({ users: { $all: [reciever_id, sender_id] } });

    return userSession||[];

});

const updateMessage=updateOneById(messageModel,['id','_id','sender_id','timestamp']);

const deleteMessage=deleteOneById(messageModel);

export {createMessage,findOneMessageSession,updateMessage,deleteMessage,createMessageSession}