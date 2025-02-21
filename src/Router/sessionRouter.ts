import express from "express";
import {
    createSession,
    deleteSession,
    findAllSession,
    findOneSession,
    updateSession
} from "../Controller/sessionController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";


const router=express.Router({mergeParams:true});

router.route('/')
    .get(findAllSession)
    .post(getUserFromJWT,grantPermission('client','coach'),createSession);

router.route('/:id')
    .get(getUserFromJWT,verifyOwnership('user_id'),findOneSession)
    .patch(getUserFromJWT,grantPermission('coach'),verifyOwnership("coach_id"),updateSession)
    .delete(getUserFromJWT,grantPermission('admin'),verifyOwnership("coach_id"),deleteSession);


export default router;

