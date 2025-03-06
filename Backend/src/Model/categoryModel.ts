import mongoose, {Model} from "mongoose";
import {ICategory} from "../Types/category.type";

const schema = new mongoose.Schema<ICategory>({
   name: { type: String, required: true },
   description: { type: String, required: true },
   image: { type: String },
});

const categoryModel:Model<ICategory>=mongoose.model("Category",schema);

export default categoryModel;