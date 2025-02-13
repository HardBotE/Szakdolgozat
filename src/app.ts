import express from 'express';
import {errorHandler} from "./Utils/AppError";
import router from "./Router/routing";

const app = express();

app.use(express.json());

app.use((req, res, next)=>{
    console.log(req);
    next();
})

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log('Request Cookie!');
    console.log(req.cookies.jwt);
    next();
});


//all conenction
app.use(router);


//error handler
app.use(errorHandler);

export default app;