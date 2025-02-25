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
    reserved:{
        type:Boolean,
        default:false
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

schema.methods.reserve= async function (){
    this.reserved=true;

    await this.save();
}

schema.methods.cancel=async function (){
    this.reserved = false;

    await this.save();
}

const availabilitySchema:Model<IAvailability>=mongoose.model('availability',schema);

export default availabilitySchema;

