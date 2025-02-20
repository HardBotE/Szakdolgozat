
import {deleteUser, findAllUsers, findUser, updateUser} from "../Controller/userController";
import {getUserFromJWT, grantPermission, loginUser, signUpUser, verifyOwnership} from "../Controller/authController";
import express from "express";

const router=express.Router();

router.route('/')
    .get(findAllUsers);

router.get('/me',getUserFromJWT,grantPermission('admin','client','coach'));

router.post('/register',signUpUser);

router.post('/login',loginUser);

router.route('/:id')
    .get(findUser)
    .patch(getUserFromJWT,verifyOwnership('id'),updateUser)
    .delete(getUserFromJWT,verifyOwnership('id'),deleteUser);





export default router;