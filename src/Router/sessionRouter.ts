import express from "express";
import {
    createSession,
    deleteSession,
    findAllSession,
    findOneSession,
    updateSession
} from "../Controller/sessionController";


const router=express.Router({mergeParams:true});

router.route('/')
    .get(findAllSession)
    .post(createSession);

router.route('/:session_id')
    .get(findOneSession)
    .patch(updateSession)
    .delete(deleteSession);


export default router;

