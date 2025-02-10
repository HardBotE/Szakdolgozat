import mongoose, {Model} from "mongoose";


const schema=new mongoose.Schema<IMessage>({
    client_id: {
        type: String,
        required: true,
    },
    coach_id:{
        type: String,
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