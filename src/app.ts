import express from 'express';
import categoryRouter from "./Router/categoryRouter";
import sessionRouter from "./Router/sessionRouter";
import userRouter from "./Router/userRouter";

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

app.use('/',categoryRouter);
app.use('/coaches',sessionRouter);
app.use('/users',userRouter);




export default app;