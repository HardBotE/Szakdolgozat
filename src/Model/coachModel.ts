import mongoose, {Model} from "mongoose";
import {ICoach} from "../Types/coach.type";

const schema = new mongoose.Schema<ICoach>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        availability:{
            day:{
                type: String,
                enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
            },
            startTime:{
                type: Date,
                required:true,
            },
            endTime:{
                type: Date,
                required:true,
            },
            reserved:{
                type:Boolean,
                default:false
            }
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            minimum: 0,

        },
        rating: {
            type: Number,
            required: true,
            minimum: 1,
            maximum: 5,
            default: 3
        }
    }
)

const coachModel:Model<ICoach>=mongoose.model("Coach",schema)

export default coachModel;