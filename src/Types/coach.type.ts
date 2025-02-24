import  {ObjectId} from "mongoose";

interface ICoach extends Document {
    user_id: ObjectId;
    category_id: ObjectId;
    description: string;
    availability?:[{
        day:string;
        startTime:Date;
        endTime:Date;
        reserved:Boolean;
    }];
    rating: number;
    price: number;
}

interface IAvailability {
    day:string;
    startTime:Date;
    endTime:Date;
    reserved:Boolean;
}

export {ICoach,IAvailability};