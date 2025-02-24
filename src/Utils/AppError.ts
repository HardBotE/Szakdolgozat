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

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || 500;
    const response = {
        status: 'error',
        statusCode,
        message: err.message || 'Internal Server Error',
        details: err.details || 'No additional information provided',
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString(),
        stack: err.stack
    };

    res.status(statusCode).json(response);
};




export {AppError,errorHandler}