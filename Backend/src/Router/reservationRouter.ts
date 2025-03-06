import {cancelOccasion, reserveOccasion} from "../Controller/availablilityController";

import express from 'express';
import {getUserFromJWT} from "../Controller/authController";

const router = express.Router();

router.post('/:id/reserve',getUserFromJWT,reserveOccasion);
router.post('/:id/cancel',getUserFromJWT,cancelOccasion);

export default router;