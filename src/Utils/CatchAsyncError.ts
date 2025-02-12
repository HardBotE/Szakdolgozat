import {RequestHandler} from "express";


const catchAsync = (fn: (...args: Parameters<RequestHandler>) => Promise<any>): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default catchAsync;