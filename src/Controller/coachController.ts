import coachModel from "../Model/coachModel";
import { deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";
import catchAsync from "../Utils/CatchAsyncError";
import {NextFunction, Request, Response} from "express";
import userModel from "../Model/userModel";
import {AppError} from "../Utils/AppError";


const findAllCoaches=findAll(coachModel);

const findCoach=findOneById(coachModel);

const createCoach= catchAsync(async function(req:Request,res:Response,next:NextFunction){
     {
        const category_id=req.params.id;
         if (!category_id) {
             return next(new AppError('Category ID is required', 400, 'Please provide a valid category ID'));
         }


         const userId=req.user.id;
         if (!userId) {
             return next(new AppError('You need to log in to your account', 400));
         }

        const input={
            category_id:category_id,
            user_id:userId,
            ...req.body,
        };

        const data= await coachModel.create(input);

        if(!data) {
            return next(new AppError('Error occurred while creating coach',404,'Please make sure that the entered data is correct'));
        }

        await userModel.findByIdAndUpdate(userId,{role:"coach"},{new:true});

        console.log(data);
        res.status(200).json({
            data,
            message:'Successfully created data',
        })

    }

})




const updateCoach=updateOneById(coachModel,['id','_id','user_id']);

const deleteCoach=deleteOneById(coachModel);

export {findAllCoaches,findCoach,createCoach,updateCoach,deleteCoach};