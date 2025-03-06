import express from "express";
import {
    createOneCategory,
    deleteOneCategory,
    findAllCategory,
    findOneCategory,
    updateCategory
} from "../Controller/categoryController";
import {createCoach, findAllCoaches} from "../Controller/coachController";
import {getUserFromJWT, grantPermission, verifyOwnership} from "../Controller/authController";



const router=express.Router();

router.route('/')
    .get(findAllCategory)
    .post(getUserFromJWT,grantPermission('admin'),createOneCategory);

router.route('/:id')
    .get(findOneCategory)
    .patch(getUserFromJWT,grantPermission('admin'),updateCategory)
    .delete(getUserFromJWT,grantPermission('admin'),deleteOneCategory);

router.route("/:id/coaches")
    .get(findAllCoaches)
    .post(getUserFromJWT,grantPermission('client'),verifyOwnership('user_id'),createCoach);





export default router;