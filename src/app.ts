import express, {NextFunction} from 'express';
import {errorHandler} from "./Utils/AppError";
import router from "./Router/routing";
import multer from "multer";
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use((req, res, next)=>{
    console.log(req.body);
    next();
});


app.use((req, res, next) => {
    console.log("🔹 Cookies received:", req.cookies);
    next();
});
/*
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Request Cookie!');
    console.log(req.cookies.jwt);
    next();
});*/


//all conenction
app.use(router);
// @ts-ignore
app.use('public/:filePath',(req: Request, res: Response, next: NextFunction) => {
    console.log('Anyatok seggget');
});

//error handler
app.use(errorHandler);

app.use((req, res, next) => {
    console.log(`🔴 Unhandled request: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: "Not Found" });
});
export default app;