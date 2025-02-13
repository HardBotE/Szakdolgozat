import express from "express";
import categoryRouter from "./categoryRouter";
import sessionRouter from "./sessionRouter";
import userRouter from "./userRouter";

const router=express.Router();

router.use('/api/categories',categoryRouter);
router.use('/api/coaches',sessionRouter);
router.use('/api/users',userRouter);

export default router;