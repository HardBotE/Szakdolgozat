import mongoose, {Model} from "mongoose";
import IAvailability from "../Types/availability.type";

const schema=new mongoose.Schema<IAvailability>({
    day:{
        type:String,
        enum:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        required:true
    },
    startTime:{
        type:Date,
        required:true
    },
    endTime:{
        type:Date,
        required:true
    },
    reservation: {
        reserved: {
            type: Boolean,
            required: true,
            default: false
        },
        reservedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        }
    },
    coach_Id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    description:{
        type:String,
        default:'Coaching'
    },
    meetingDetails:{
        type:String,
        default:'This meeting currently has no details where it will be held. For more information contact your coach.'
    }

});

const availabilitySchema:Model<IAvailability>=mongoose.model('availability',schema);

export default availabilitySchema;

