import express from "express";
import sessionRouter from "./sessionRouter";
import messageRouter from "./messageRouter";
import {deleteCoach, findCoach, updateCoach} from "../Controller/coachController";

const router=express.Router();

router.route("/:coach_id")
    .get(findCoach)
    .patch(updateCoach)
    .delete(deleteCoach);

router.use('/:coach_id/sessions',sessionRouter);
router.use('/:coach_id/messages',messageRouter);
