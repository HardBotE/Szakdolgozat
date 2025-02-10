import mongoose, {Model} from "mongoose";


const schema= new mongoose.Schema<IClient>({
    user_id: {
        type: String,
        required: true,
    },
    sub_type:{
        type:String,
        required:true,
        default:"normal",
    },
});

const clientModel:Model<IClient>=mongoose.model('Client',schema);

export default clientModel;