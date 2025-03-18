import {cancelOccasion, reserveOccasion} from "../Controller/availablilityController";

import express from 'express';
import {getUserFromJWT} from "../Controller/authController";

const router = express.Router();
router.post('/:id/cancel',getUserFromJWT,cancelOccasion);
router.post('/:id/reserve',getUserFromJWT,reserveOccasion);


export default router;