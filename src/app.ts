import express from 'express';
import {errorHandler} from "./Utils/AppError";
import router from "./Router/routing";
import cookieParser from 'cookie-parser';
const app = express();

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


//error handler
app.use(errorHandler);

app.use((req, res, next) => {
    console.log(`🔴 Unhandled request: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: "Not Found" });
});
export default app;