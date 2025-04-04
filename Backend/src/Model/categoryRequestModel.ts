import mongoose, {Model, ObjectId} from "mongoose";
import ICategoryRequest from "../Types/categoryRequest.type";

const Schema = new mongoose.Schema<ICategoryRequest>({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    category_name:{
        type:String,
        required:true
    },
    category_description:{
        type:String,
        required:true
    },
    further_details:{
        type:String,
        default:"No additional information provided"
    }
});

const RequestModel:Model<ICategoryRequest>=mongoose.model("RequestModel",Schema)

export default RequestModel;