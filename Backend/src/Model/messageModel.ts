import mongoose, { Model } from "mongoose";
import { IMessage } from "../Types/message.type";

const messageSchema = new mongoose.Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    //ha minden igaz akkor a letrehozashoz csak 2 szemely kell
    messages: [{
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sender_name: String,
        text: { type: String },
        timestamp: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const messageModel: Model<IMessage> = mongoose.model<IMessage>("Message", messageSchema);

export default messageModel;
