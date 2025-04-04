import express from "express";
import sessionRouter from "./sessionRouter";
import {
    deleteCoach,
    findCoach, findCoachByCategoryId,
    updateCoach
} from "../Controller/coachController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";

import {
    createAvailability,
    deleteAvailability,
    getAvailability,
    getOneAvailability, updateAvailability
} from "../Controller/availablilityController";
import {createMessageSession} from "../Controller/messageController";

const router=express.Router();

router.route('/availability/getFiltered')
    .post(getOneAvailability);

router.route('/getCoachByUserid')
    .post(findCoachByCategoryId)

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

router.route('/:id/message')
    .post(getUserFromJWT,createMessageSession);



router.use('/:id/sessions',sessionRouter);


export default router;