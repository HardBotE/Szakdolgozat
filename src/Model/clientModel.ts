import mongoose, {Model} from "mongoose";
import {IClient} from "../Types/client.type";


const schema= new mongoose.Schema<IClient>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sub_type:{
        type:String,
        required:true,
        default:"normal",
    },
});

const clientModel:Model<IClient>=mongoose.model('Client',schema);

export default clientModel;