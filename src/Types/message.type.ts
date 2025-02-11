import mongoose from "mongoose";

interface IMessage extends Document {
    client_id: mongoose.Schema.Types.ObjectId;
    coach_id: mongoose.Schema.Types.ObjectId;
    message: string;
    timestamp: string;
}

export {IMessage};