import coachModel from "../Model/coachModel";
import { deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";
import catchAsync from "../Utils/CatchAsyncError";
import {NextFunction, Request, Response} from "express";
import userModel from "../Model/userModel";
import {AppError} from "../Utils/AppError";
import CoachModel from "../Model/coachModel";



const findAllCoaches = catchAsync(async (req: Request, res: Response) => {

    const category_id=req.params.id;

    const coaches=await CoachModel.find({category_id:category_id});

    res.status(200).json({
        message:'Successfully retrieved coaches.',
        data:coaches
    });

})

const findCoach = findOneById(coachModel);

const createCoach = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    {
        const category_id = req.params.id;
        if (!category_id) {
            return next(new AppError('Category ID is required', 400, 'Please provide a valid requestCategory ID'));
        }


        const userId = req.user.id;
        if (!userId) {
            return next(new AppError('You need to log in to your account', 400));
        }

        const input = {
            category_id: category_id,
            user_id: userId,
            ...req.body,
        };

        const data = await coachModel.create(input);

        if (!data) {
            return next(new AppError('Error occurred while creating coach', 404, 'Please make sure that the entered data is correct'));
        }

        await userModel.findByIdAndUpdate(userId, {role: "coach"}, {new: true});

        console.log(data);
        res.status(200).json({
            data,
            message: 'Successfully created data',
        })

    }

})

const updateCoach = updateOneById(coachModel, ['id', '_id', 'user_id']);

const deleteCoach = deleteOneById(coachModel);

const findCoachByCategoryId=catchAsync(async (req: Request, res: Response) => {
    console.log('In requestCategory');
    const user_id=req.body.user_id;
    console.log(user_id);

    const coach=await CoachModel.find({user_id:user_id});
    console.log(coach);
    res.status(200).json({
        message:'Successfully retrieved coach.',
        data:coach
    });
})

export {findAllCoaches,findCoach,createCoach,updateCoach,deleteCoach,findCoachByCategoryId};