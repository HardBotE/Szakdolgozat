import express from "express";
import sessionRouter from "./sessionRouter";
import {deleteCoach, findCoach, updateCoach} from "../Controller/coachController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";

const router=express.Router();

router.route("/:coach_id")
    .get(findCoach)
    .patch(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('user_id'),updateCoach)
    .delete(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('user_id'),deleteCoach);

router.use('/:coach_id/sessions',sessionRouter);

