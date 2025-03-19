import mongoose, {Model} from "mongoose";
import {ICategory} from "../Types/category.type";

const schema = new mongoose.Schema<ICategory>({
   name: { type: String, required: true },
   description: { type: String, required: true },
   background_image: { type: String,default:'public/category_backgrounds/fallbackimage.jpg' },
});

const categoryModel:Model<ICategory>=mongoose.model("Category",schema);

export default categoryModel;