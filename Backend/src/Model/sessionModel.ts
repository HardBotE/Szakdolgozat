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
        type:{
            day:{
                type:String,
                enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                required:true,
            },
            startTime:{
                type:Date,
                required:true,
            },
            endTime:{
              type:Date,
              required:true,
            }
        },
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