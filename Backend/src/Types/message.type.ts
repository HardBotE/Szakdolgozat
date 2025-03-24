import mongoose from "mongoose";

interface IMessage extends Document {
    users: mongoose.Schema.Types.ObjectId[];
    messages?: {
        sender_name: string;
        sender: mongoose.Schema.Types.ObjectId;
        text: string;
        timestamp: Date;
    }[];
}

export { IMessage };
