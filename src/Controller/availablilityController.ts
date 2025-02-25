import catchAsync from "../Utils/CatchAsyncError";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import coachModel from "../Model/coachModel";
import availabilityModel from "../Model/availabilityModel";
import IAvailability from "../Types/availability.type";




const createAvailability = catchAsync(async function (req: Request, res: Response, next: NextFunction) {

    const coach = await coachModel.findOne({user_id: req.user.id});

    if (!coach) {
        return next(new AppError("Coach account not found", 404, "Please make sure that the entered data is correct."));
    }

    if (!req.body.availability || !Array.isArray(req.body.availability) || req.body.availability.length === 0) {
        return next(new AppError("Invalid input", 400, "Please provide an array of availabilities with day, startTime, and endTime."));
    }

    const availabilitiesArray = req.body.availability.map((data:IAvailability) => ({
        coach_Id: coach._id,
        day: data.day,
        price:data.price,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        reserved: false
    }));


    const currentAvailabilites = await availabilityModel.find({coach_Id: coach._id});

    const validAvailabilities: any[] = [];
    const conflicts: any[] = [];

    for (const newAvailability of availabilitiesArray) {
        const {day, startTime, endTime} = newAvailability;

        const conflict = currentAvailabilites.some(currentData =>
            currentData.day === day &&
            (
                (currentData.startTime <=startTime || startTime > currentData.endTime) &&
                (currentData.startTime <=endTime  || endTime >currentData.endTime) &&
                (startTime < endTime)));

        if (conflict) {
            conflicts.push({...newAvailability, error: "Time conflict with an existing availability"});
        } else {
            validAvailabilities.push(newAvailability);
        }
    }

    await availabilityModel.insertMany(validAvailabilities);

        res.status(201).json({
            status: "success",
            added: validAvailabilities,
            conflicts,
            message: validAvailabilities.length > 0
                ? "Some availabilities were added successfully."
                : "No availabilities were added due to conflicts."
        });

});

const deleteAvailability = catchAsync(async function (req: Request, res: Response, next: NextFunction) {

    const coach = await coachModel.findOne({ user_id: req.user.id });

    if (!coach) {
        return next(new AppError("Coach account not found", 404, "Please make sure that the entered data is correct."));
    }

    if (!req.body.cancelAvailability || !Array.isArray(req.body.cancelAvailability) || req.body.cancelAvailability.length === 0) {
        return next(new AppError("Invalid input", 400, "Please provide a valid array of availabilities to cancel."));
    }

    const deleteConditions = req.body.cancelAvailability.map(({ day, startTime, endTime }: any) => ({
        coach_Id: coach._id,
        day: day,
        startTime: new Date(startTime),
        endTime: new Date(endTime)
    }));

    await availabilityModel.deleteMany({ $or: deleteConditions });

    res.status(200).json({
        status: "success",
        message: "Successfully deleted availability."
    });
});

const getAvailability = catchAsync(async function (req: Request, res: Response, next: NextFunction) {

    const coach = await coachModel.findById((req.params.id));

    if (!coach) {
        return next(new AppError("Coach account not found", 404, "Please make sure that the entered data is correct."));
    }

    const availability = await availabilityModel.find({ coach_Id: req.params.id });

    res.status(200).json({
        status: "success",
        data: availability
    });
});

export { createAvailability, deleteAvailability, getAvailability };
