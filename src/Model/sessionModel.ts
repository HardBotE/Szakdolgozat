import mongoose from "mongoose";
import {Model} from "mongoose";

const schema=new mongoose.Schema<ISession>({
    client_id:{
        type:String,
        required:true
    },
    coach_id:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'pending'
    }

});

const sessionModel:Model<ISession>=mongoose.model('Session',schema);

export default sessionModel;