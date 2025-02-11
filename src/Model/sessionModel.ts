import mongoose from "mongoose";
import {Model} from "mongoose";
import {ISession} from "../Types/session.type";

const schema=new mongoose.Schema<ISession>({
    client_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Client",
        required:true
    },
    coach_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Coach",
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