import mongoose from "mongoose";

interface ICoach extends Document {
    user_id: mongoose.Schema.Types.ObjectId;
    category_id: mongoose.Schema.Types.ObjectId;
    description: string;
    rating: number;
    price: number;
}

export {ICoach};