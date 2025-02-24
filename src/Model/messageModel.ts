import mongoose, {Model} from "mongoose";
import {IMessage} from "../Types/message.type";


const schema=new mongoose.Schema<IMessage>({
    client_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        min:1
    }],
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message:{
        type: String,
    },
    timestamp:{
        type:String,
    }
});

const messageModel:Model<IMessage>=mongoose.model("Message",schema);

export default messageModel;
