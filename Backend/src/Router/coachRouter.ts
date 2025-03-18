import express from "express";
import sessionRouter from "./sessionRouter";
import {
    deleteCoach,
    findCoach,
    updateCoach
} from "../Controller/coachController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";
import messageRouter from "./messageRouter";
import {
    createAvailability,
    deleteAvailability,
    getAvailability,
    getOneAvailability, updateAvailability
} from "../Controller/availablilityController";

const router=express.Router();

router.route('/availability/getFiltered')
    .post(getOneAvailability);

router.route('/availability/:id')
    .patch(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('user_id'),updateAvailability);

router.route("/:id")
    .get(findCoach)
    .patch(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('user_id'),updateCoach)
    .delete(getUserFromJWT,grantPermission('admin','coach'),verifyOwnership('id'),deleteCoach);

router.route('/:id/availability')
    .get(getAvailability)
    .post(getUserFromJWT,grantPermission('coach'),verifyOwnership('user_id'),createAvailability)
    .delete(getUserFromJWT,grantPermission('coach'),deleteAvailability);




router.use('/:id/sessions',sessionRouter);
router.use('/:id/messages',messageRouter);

export default router;