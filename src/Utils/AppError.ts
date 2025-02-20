import {NextFunction,Request,Response} from "express";

class AppError extends Error {
    public readonly status: number;
    public  readonly details?: string;
    constructor(message: string,statusCode: number, details?: string) {
        super(message);

        this.status= statusCode;
        this.details=details;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler=(err:AppError,req:Request,res:Response,next:NextFunction) => {
    res.status(err.status||500).json({
       status:'error',
       message:err.message,
       details:err.details || 'No additional information',
    });

}



export {AppError,errorHandler}