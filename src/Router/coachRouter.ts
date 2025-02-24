import express from "express";
import sessionRouter from "./sessionRouter";
import {
    createAvailability,
    deleteAvailability,
    deleteCoach,
    findCoach,
    updateCoach
} from "../Controller/coachController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";
import messageRouter from "./messageRouter";

const router=express.Router();

router.route("/:id")
    .get(findCoach)
    .patch(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('user_id'),updateCoach)
    .delete(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('id'),deleteCoach);

router.route('/:id/availability')
    .post(getUserFromJWT,grantPermission('coach'),verifyOwnership('id'),createAvailability)
    .delete(getUserFromJWT,grantPermission('coach'),deleteAvailability);


router.use('/:id/sessions',sessionRouter);
router.use('/:id/messages',messageRouter);

export default router;