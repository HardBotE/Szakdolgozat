import mongoose, {ObjectId} from "mongoose";

interface IAvailability extends Document {
        day:string;
        startTime:Date;
        endTime:Date;
        reservation:{
                reserved:boolean;
                reservedBy:mongoose.Schema.Types.ObjectId;
        };
        price:number;
        description:string;
        meetingDetails:string;
        coach_Id:mongoose.Schema.Types.ObjectId;
}

export default IAvailability;