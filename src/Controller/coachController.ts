import coachModel from "../Model/coachModel";
import { deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";
import catchAsync from "../Utils/CatchAsyncError";
import {NextFunction, Request, Response} from "express";
import userModel from "../Model/userModel";
import {AppError} from "../Utils/AppError";
import {IAvailability, ICoach} from "../Types/coach.type";
import {Document, Types} from "mongoose";


const findAllCoaches = findAll(coachModel);

const findCoach = findOneById(coachModel);

const createCoach = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    {
        const category_id = req.params.id;
        if (!category_id) {
            return next(new AppError('Category ID is required', 400, 'Please provide a valid category ID'));
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

const createAvailability = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    if (req.user.role !== 'coach') {
        return next(new AppError('Unauthorized', 403, 'Please become a coach to create your schedule.'));
    }

    const coach = await coachModel.findOne({user_id: req.user.id});

    if (!coach) {
        return next(new AppError('Coach account not found', 404, 'Please make sure that the entered data is correct.'));
    }

    if (!req.body.availability || req.body.availability.length === 0) {
        return next(new AppError('Invalid input', 400, 'Please provide an array of availabilities with day, startTime, and endTime.'));
    }

    const previous_availabilities: IAvailability[] = coach.availability || [];
    const validAvailabilities: IAvailability[] = [];
    const conflictedData: any[] = [];

    for (const candidateAvailability of req.body.availability) {
        const {day, startTime, endTime} = candidateAvailability;

        const parsedStartTime = new Date(startTime);
        const parsedEndTime = new Date(endTime);

        console.log("Parsed Dates:", parsedStartTime, parsedEndTime);

        // Ellenőrizzük, hogy a konverzió sikeres volt-e
        if (!day || isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
            conflictedData.push({...candidateAvailability, error: 'Invalid date format'});
            continue;
        }

        const conflict = previous_availabilities.some(avail =>
            avail.day === day &&
            ((parsedStartTime >= avail.startTime && parsedStartTime < avail.endTime) ||
                (parsedEndTime > avail.startTime && parsedEndTime <= avail.endTime) ||
                (parsedStartTime <= avail.startTime && parsedEndTime >= avail.endTime))
        );

        if (conflict) {
            conflictedData.push({...candidateAvailability, error: 'Time conflict with an existing availability'});
        } else {
            validAvailabilities.push({
                day,
                startTime: parsedStartTime,
                endTime: parsedEndTime,
                reserved: false
            });
        }
    }

    if (validAvailabilities.length > 0) {
        await coachModel.updateOne(
            {user_id: req.user.id},
            {$push: {availability: {$each: validAvailabilities}}}
        );
    }

    res.status(201).json({
        status: 'success',
        added: validAvailabilities,
        conflicts: conflictedData,
        message: validAvailabilities.length > 0
            ? 'Some availabilities were added successfully'
            : 'No availabilities were added due to conflicts or missing fields'
    });
});

const deleteAvailability = catchAsync(async function (req: Request, res: Response, next: NextFunction) {

    if (req.user.role !== 'coach') {
        return next(new AppError('Unauthorized', 403, 'Please become a coach to delete your OWN schedule.'));
    }

    const coach = await coachModel.findOne({ user_id: req.user.id });

    if (!coach) {
        return next(new AppError('Coach account not found', 404, 'Please make sure that the entered data is correct.'));
    }

    if (!req.body.cancelAvailability || req.body.cancelAvailability.length === 0) {
        return next(new AppError('Invalid input', 400, 'Please provide an the desired availability to cancel'));
    }

    const {day, startTime, endTime} = req.body.cancelAvailability;


    const dateStartTime = new Date(startTime);
    const dateEndTime= new Date(endTime);


    const filteredObject=coach.availability.filter(candidate =>
         !(day===candidate.day &&
            JSON.stringify(dateStartTime) === JSON.stringify(candidate.startTime) &&
            JSON.stringify(dateEndTime) === JSON.stringify(candidate.endTime))
    )
    await coachModel.updateOne(
        {user_id: req.user.id},
        {$set: {availability:  filteredObject}}
    );

    res.status(200).json({
        message:'Successfully deleted given date from the availability list',
    })
})

export {findAllCoaches,findCoach,createCoach,updateCoach,deleteCoach,createAvailability,deleteAvailability};