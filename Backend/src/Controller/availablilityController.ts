import catchAsync from "../Utils/CatchAsyncError";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../Utils/AppError";
import coachModel from "../Model/coachModel";
import availabilityModel from "../Model/availabilityModel";
import IAvailability from "../Types/availability.type";
import sessionModel from "../Model/sessionModel";
import mongoose from "mongoose";
import {updateOneById} from "./FactoryController";

const createAvailability = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const coach = await coachModel.findOne({ user_id: req.user.id });

    if (!coach) {
        return next(new AppError("Coach account not found", 404, "Please make sure that the entered data is correct."));
    }

    const { startTime, endTime, price, description, meetingDetails } = req.body;

    if (!startTime || !endTime || !price) {
        return next(new AppError("Invalid input", 400, "Please provide startTime, endTime, and price."));
    }

    const newAvailability = {
        coach_Id: coach._id,
        price,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reservation: {
            reserved: false,
            reservedBy: null
        },
        description,
        meetingDetails
    };

    // Ellenőrizzük, hogy van-e időütközés
    const conflict = await availabilityModel.exists({
        coach_Id: coach._id,
        $or: [
            { startTime: { $lt: newAvailability.endTime }, endTime: { $gt: newAvailability.startTime } }
        ]
    });

    if (conflict) {
        return next(new AppError("Time conflict", 400, "This time slot overlaps with an existing availability."));
    }

    // Ha nincs ütközés, mentjük az új elérhetőséget
    const createdAvailability = await availabilityModel.create(newAvailability);

    res.status(201).json({
        status: "success",
        data: createdAvailability,
        message: "Availability was added successfully."
    });
});

const deleteAvailability = catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const coach = await coachModel.findOne({ user_id: req.user.id });

    if (!coach) {
        return next(new AppError("Coach account not found", 404, "Please make sure that the entered data is correct."));
    }

   const availabilityId=req.params.id;

    const deletedAvailability = await availabilityModel.findByIdAndDelete(availabilityId);

    if (!deletedAvailability) {
        return next(new AppError("Availability not found", 404, "No matching availability found to delete."));
    }

    res.status(200).json({
        status: "success",
        message: "Successfully deleted availability.",
        deletedAvailability
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

const getOneAvailability=catchAsync(async function (req: Request, res: Response, next: NextFunction) {

    const availability= await availabilityModel.findOne(req.body);

    res.status(200).json({
        status: "success",
        data:availability
    })

})

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

const updateAvailability=updateOneById(availabilityModel);

export { createAvailability,updateAvailability, deleteAvailability, getAvailability,reserveOccasion,cancelOccasion,getOneAvailability };
