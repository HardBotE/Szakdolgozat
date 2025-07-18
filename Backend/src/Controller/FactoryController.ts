import {Model} from "mongoose";
import {NextFunction, Request, RequestHandler, Response} from "express";
import catchAsync from "../Utils/CatchAsyncError";
import {AppError} from "../Utils/AppError";


const findAll=<T extends Document>(Model:Model<T>):RequestHandler=>
    catchAsync(async (req:Request,res:Response,next:NextFunction)=>{

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
        console.log(req.params);
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

const updateOneById = <T extends Document>(
    Model: Model<T>,
    restrictions?: string[]
) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        if (restrictions) {
            Object.keys(req.body).forEach((key) => {
                if (restrictions.includes(key)) {
                    return next(
                        new AppError(
                            `Cannot override ${key}!`,
                            403,
                            'The user tried to modify a value but has no permission in this route!'
                        )
                    );
                }
            });
        }

        console.log("Updating ID:", req.params.id);
        console.log("Request body:", req.body);

        const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,  // Ellenőrzi a model validációs szabályait
        });

        if (!data) {
            return res.status(404).json({
                message: "No element found with that ID",
            });
        }

        return res.status(200).json({
            data,
            message: "Successfully updated data",
        });
    });

const deleteOneById=<T extends Document>(Model:Model<T>)=>
    catchAsync(async (req:Request,res:Response,next:NextFunction)=>{

        const data=await Model.findByIdAndDelete(req.params.id) ;

        console.log(data);
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