import express from "express";
import {
    createSession,
    deleteSession,
    findAllSession,
    findOneSession,
    updateSession
} from "../Controller/sessionController";

const router=express.Router();

router.route('/:coach_id/session')
    .get(findAllSession)
    .post(createSession);

router.route('/:coach_id/session/:session_id')
    .get(findOneSession)
    .patch(updateSession)
    .delete(deleteSession);

export default router;

