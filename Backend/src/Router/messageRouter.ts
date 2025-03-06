import express from "express";
import {
    createMessage,
    deleteMessage,
    findAllMessages,
    findOneMessage,
    updateMessage
} from "../Controller/messageController";
import {getUserFromJWT, verifyOwnership} from "../Controller/authController";

const messageRouter=express.Router({mergeParams:true});

messageRouter.route('/')
    .get(getUserFromJWT,findAllMessages)
    .post(getUserFromJWT,createMessage);

messageRouter.route('/:message_id')
    .get(getUserFromJWT,findOneMessage)
    .patch(getUserFromJWT,verifyOwnership("sender_id"),updateMessage)
    .delete(getUserFromJWT,verifyOwnership("sender_id"),deleteMessage);

export default messageRouter;