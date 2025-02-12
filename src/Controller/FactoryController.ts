import {Model} from "mongoose";
import {NextFunction, Request, RequestHandler, Response} from "express";
import catchAsync from "../Utils/CatchAsyncError";


const findAll=<T extends Document>(Model:Model<T>):RequestHandler=>
    catchAsync(async (req,res,next)=>{

    const data=await Model.find();

        if(!data)
            res.status(404).json({
                message:'No element found with that ID'
            });

    res.status(200).json({
        data,
        message:'Successfully sent data'
    });

});

const findOneById=<T extends Document>(Model:Model<T>)=>
    catchAsync(async (req:Request,res:Response,next:NextFunction)=>{

        const data=await Model.findById(req.params.id);

        if(!data)
            res.status(404).json({
                message:'No element found with that ID'
            });

        res.status(200).json({
            data,
            message:'Successfully retrieve data'
        });
    });

const updateOneById=<T extends Document>(Model:Model<T>)=>
    catchAsync(async (req:Request,res:Response,next:NextFunction)=>{

        const data=await Model.findByIdAndUpdate(req.params.id,req.body,{new:true});

        if(!data)
            res.status(404).json({
                message:'No element found with that ID'
            });

        res.status(200).json({
            data,
            message:'Successfully updated data'
        });

    });

const deleteOneById=<T extends Document>(Model:Model<T>)=>
    catchAsync(async (req:Request,res:Response,next:NextFunction)=>{

        const data=await Model.findByIdAndDelete(req.params.id);

        res.status(200).json({
            data:null,
            message:'Successfully deleted data'
        });
    });

const createOne=<T extends Document>(Model:Model<T>)=>
    catchAsync(async (req:Request,res:Response,next:NextFunction)=>{

        const data= await Model.create(req.body);

        res.status(200).json({
            data,
            message:'Successfully created data',
        })
    })

export {createOne,findAll,findOneById,updateOneById,deleteOneById};