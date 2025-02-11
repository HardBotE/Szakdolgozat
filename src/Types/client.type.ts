import mongoose from "mongoose";

interface IClient extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    sub_type:'normal'|'premium';
}

export {IClient};