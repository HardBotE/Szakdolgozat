import sessionModel from "../Model/sessionModel";
import {deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";
import catchAsync from "../Utils/CatchAsyncError";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {AppError} from "../Utils/AppError";
import coachModel from "../Model/coachModel";
import availabilityModel from "../Model/availabilityModel";

const createSession= catchAsync(async function(req:Request,res:Response,next:NextFunction){
    {
        const coach_id=req.params.id;
        const userId=req.user.id;


        const input={
            coach_id,
            client_id:userId,
            ...req.body,
        };
        console.log(input);

        const data= await sessionModel.create(input);

        if(!data) {
            return next(new AppError('Error occurred while creating coach',404,'Please make sure that the entered data is correct'));
        }


        console.log(data);
        res.status(200).json({
            data,
            message:'Successfully created session',
        })

    }

})

//lehet reworkolom
const updateSession = catchAsync(async function(req: Request, res: Response, next: NextFunction) {
    const session_id = req.params.id;

    const sessionData=await sessionModel.findById(session_id);

    const availability = await availabilityModel.findOneAndUpdate(
        {coach_Id:sessionData.coach_id,
            startTime:sessionData.date.startTime,
            endTime:sessionData.date.endTime,
        },
        {startTime:req.body.startTime,
            endTime:req.body.endTime,
        },
        {new: true}
    );

    const session = await sessionModel.findByIdAndUpdate(
        session_id,
        {
            'date.startTime': req.body.startTime,
            'date.endTime': req.body.endTime
        },
        { new: true } // Ez a kulcs opció: a frissített dokumentumot adja vissza
    );

    console.log(session);

    if (!session) {
        return next(new Error('Session not found'));
    }

    res.status(200).json({
        status: "success",
        data: session,
        avail:availability,
    });
});

const findOneSession=findOneById(sessionModel);

const findAllSession = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let data;

    if (req.user.role === 'client' || req.user.role === 'admin') {

        data = await sessionModel.find({ client_id: req.user.id });
    }

    if (req.user.role === 'coach') {

        const coach = await coachModel.findOne({ user_id: req.user.id });

        if (!coach) {
            return next(new AppError("Coach account not found", 404, "Make sure you are registered as a coach."));
        }

        data = await sessionModel.find({ coach_id: coach._id });
    }

    if (!data || data.length === 0) {
        return res.status(404).json({
            message: "No sessions found."
        });
    }

    res.status(200).json({
        data,
        message: "Successfully retrieved sessions."
    });
});

const deleteSession= deleteOneById(sessionModel);

export {createSession,updateSession,findOneSession,deleteSession,findAllSession};