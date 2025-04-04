import mongoose, {ObjectId} from "mongoose";

interface ICategoryRequest extends Document{

    user_id:mongoose.Schema.Types.ObjectId;
    category_name:String;
    category_description:String;
    further_details:String;

}

export = ICategoryRequest;