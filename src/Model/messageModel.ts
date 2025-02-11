import mongoose, {Model} from "mongoose";
import {IMessage} from "../Types/message.type";


const schema=new mongoose.Schema<IMessage>({
    client_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    coach_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach",
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
