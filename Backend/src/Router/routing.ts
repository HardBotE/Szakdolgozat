import express from "express";
import categoryRouter from "./categoryRouter";
import sessionRouter from "./sessionRouter";
import userRouter from "./userRouter";
import coachRouter from "./coachRouter";
import reservationRouter from "./reservationRouter";
import uploadRouter from "./uploadRouter";

const router=express.Router();

router.use('/api/categories',categoryRouter);
router.use('/api/coaches',coachRouter);
router.use('/api/sessions',sessionRouter);
router.use('/api/users',userRouter);
router.use('/api/reservations',reservationRouter);
/**/
router.use('/api/uploads/',uploadRouter);
export default router;