import  {ObjectId} from "mongoose";

interface ICoach extends Document {
    user_id: ObjectId;
    category_id: ObjectId;
    motto:string;
    description: string;
    rating: number;
    price: number;
}



export {ICoach};