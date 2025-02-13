import express from "express";
import {
    createMessage,
    deleteMessage,
    findAllMessages,
    findOneMessage,
    updateMessage
} from "../Controller/messageController";

const messageRouter=express.Router({mergeParams:true});

messageRouter.route('/')
    .get(findAllMessages)
    .post(createMessage);

messageRouter.route('/:message_id')
    .get(findOneMessage)
    .patch(updateMessage)
    .delete(deleteMessage);

export default messageRouter;