import mongoose, {ObjectId} from "mongoose";

interface IMessage extends Document {
    client_ids: ObjectId[];
    sender_id: ObjectId;
    message: string;
    timestamp: string;
}

export {IMessage};