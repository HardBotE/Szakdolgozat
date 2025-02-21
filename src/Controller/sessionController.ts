import sessionModel from "../Model/sessionModel";
import {deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";
import catchAsync from "../Utils/CatchAsyncError";
import {NextFunction, Request, Response} from "express";
import {AppError} from "../Utils/AppError";

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
const updateSession=updateOneById(sessionModel,['id','_id','user_id','coach_id']);

const findOneSession=findOneById(sessionModel);

const findAllSession=findAll(sessionModel);

const deleteSession= deleteOneById(sessionModel);


export {createSession,updateSession,findOneSession,deleteSession,findAllSession};