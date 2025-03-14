import catchAsync from "../Utils/CatchAsyncError";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import coachModel from "../Model/coachModel";
import availabilityModel from "../Model/availabilityModel";
import IAvailability from "../Types/availability.type";
import sessionModel from "../Model/sessionModel";
import mongoose from "mongoose";




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
        reservation: {
            reserved: false,
            reservedBy: null
        },
        description: data.description,
        meetingDetails:data.meetingDetails,
    }));


    const currentAvailabilites = await availabilityModel.find({coach_Id: coach._id});

    const validAvailabilities: any[] = [];
    const conflicts: any[] = [];

    for (const newAvailability of availabilitiesArray) {
        const {day, startTime, endTime} = newAvailability;
        console.log(newAvailability);
        const conflict = currentAvailabilites.some(currentData =>
            currentData.day === day &&
            (
                (startTime >= currentData.startTime && startTime < currentData.endTime) ||
                (endTime > currentData.startTime && endTime <= currentData.endTime) ||
                (startTime < currentData.startTime && endTime > currentData.endTime)
        ));

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
                    ? "Availabilities were added successfully."
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

const reserveOccasion = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const occasion = await availabilityModel.findById(req.params.id);

    if (!occasion) {
        return next(new AppError("Availability not found", 404, "The selected availability does not exist."));
    }

    if (occasion.reservation.reserved) {
        return next(new AppError("Already reserved", 400, "This availability is already reserved."));
    }
    const updatedOccasion = await availabilityModel.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                "reservation.reserved": true,
                "reservation.reservedBy": new mongoose.Types.ObjectId(req.user.id)
            }
        },
        { new: true }
    );

    console.log(updatedOccasion);

    const session = await sessionModel.create({
        date: {
            day: updatedOccasion.day,
            startTime: updatedOccasion.startTime,
            endTime: updatedOccasion.endTime
        },
        coach_id: updatedOccasion.coach_Id,
        client_id: req.user.id
    });

    res.status(200).json({
        status: "success",
        message: "Successfully reserved availability",
        session,
        occasion: updatedOccasion
    });
});

const cancelOccasion = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const session = await sessionModel.findByIdAndUpdate(req.params.id,{status:"canceled"},{new: true});

    if (!session) {
        return next(new AppError("Session not found", 404, "The session does not exist."));
    }

    const occasion = await availabilityModel.findOneAndUpdate(
        {
            coach_Id: session.coach_id,
            day: session.date.day,
            startTime: session.date.startTime,
            endTime: session.date.endTime,
            "reservation.reserved": true,
            "reservation.reservedBy": new mongoose.Types.ObjectId(req.user.id)
        },
        { $set: { "reservation.reserved": false, "reservation.reservedBy": null } },
        { new: true }
    );

    if (!occasion) {
        return next(new AppError("Cannot cancel session", 404, "You cannot cancel a session you don't own."));
    }

    res.status(200).json({
        status: "success",
        message: "Successfully cancelled reservation",
        session,
        occasion
    });
});

export { createAvailability, deleteAvailability, getAvailability,reserveOccasion,cancelOccasion };
