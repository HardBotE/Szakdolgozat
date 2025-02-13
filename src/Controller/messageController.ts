import messageModel from "../Model/messageModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";

const createMessage=createOne(messageModel);

const findAllMessages=findAll(messageModel);

const findOneMessage=findOneById(messageModel);

const updateMessage=updateOneById(messageModel);

const deleteMessage=deleteOneById(messageModel);

export {createMessage,findAllMessages,findOneMessage,updateMessage,deleteMessage};