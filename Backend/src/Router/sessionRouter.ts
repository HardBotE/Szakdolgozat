import express, {NextFunction} from "express";
import {
    createSession,
    deleteSession,
    findAllSession,
    findOneSession,
    updateSession
} from "../Controller/sessionController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";
import {checkPayment, payment} from "../Payment/payment";


const router=express.Router({mergeParams:true});

router.route('/')
    .get(getUserFromJWT,findAllSession)
    .post(getUserFromJWT,grantPermission('client','coach'),createSession);

router.route('/:id')
    .get(getUserFromJWT,verifyOwnership('user_id'),findOneSession)
    .patch(getUserFromJWT,grantPermission('coach'),verifyOwnership("coach_id"),updateSession)
    .delete(getUserFromJWT,grantPermission('admin'),verifyOwnership("user_id"),deleteSession);


router.post('/:id/payment', payment);

// @ts-ignore
router.post('/:id/check_payment',checkPayment);



export default router;

