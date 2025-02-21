import express from "express";
import sessionRouter from "./sessionRouter";
import {deleteCoach, findCoach, updateCoach} from "../Controller/coachController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";

const router=express.Router();

router.route("/:id")
    .get(findCoach)
    .patch(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('user_id'),updateCoach)
    .delete(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('id'),deleteCoach);

router.use('/:id/sessions',sessionRouter);

export default router;