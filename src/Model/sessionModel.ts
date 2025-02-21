import mongoose from "mongoose";
import {Model} from "mongoose";
import {ISession} from "../Types/session.type";

const schema=new mongoose.Schema<ISession>({
    client_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    coach_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Coach",
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["pending","paid","unpaid","canceled"],
        default:'pending'
    }

});

const sessionModel:Model<ISession>=mongoose.model('Session',schema);

export default sessionModel;