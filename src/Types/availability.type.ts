import mongoose from "mongoose";

interface IAvailability extends Document {
        day:string;
        startTime:Date;
        endTime:Date;
        reserved:Boolean;
        price:number;
        description:string;
        meetingDetails:string;
        coach_Id:mongoose.Schema.Types.ObjectId;
}

export default IAvailability;