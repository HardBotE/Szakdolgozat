import mongoose, {Model} from "mongoose";
import {ICoach} from "../Types/coach.type";
import {NextFunction} from "express";

const schema = new mongoose.Schema<ICoach>(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        motto:{
            type:String,
        },
        description: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
            default: 3
        }
    },
    {
        toJSON: {virtuals: true},
        toObject:{virtuals:true},
    }
);

schema.index({ user_id: 1, category_id: 1 }, { unique: true });

schema.virtual("user", {
    ref: "User",
    localField: "user_id",
    foreignField: "_id",
    justOne:true

});

schema.virtual("category", {
    ref: "Category",
    localField:"category_id",
    foreignField: "_id",
    justOne:true
});

schema.pre(/^find/,function (this:any,next:NextFunction){
this.populate({
    path: "user_id",
    select:'-__v -password'
}).populate({
    path:"category_id",
})
    next();
});

const coachModel:Model<ICoach>=mongoose.model("Coach",schema)

export default coachModel;