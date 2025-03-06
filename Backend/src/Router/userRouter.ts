
import {deleteUser, findAllUsers, findUser, updateUser} from "../Controller/userController";
import {
    getUserFromJWT,
    grantPermission,
    loginUser,
    signUpUser,
    verifyOwnership,
    passwordReset,
    generateResetToken, passwordResetWithToken
} from "../Controller/authController";
import express from "express";

const router=express.Router();

router.route('/')
    .get(findAllUsers);

router.get('/me',getUserFromJWT,grantPermission('admin','client','coach'));

router.post('/register',signUpUser);

router.post('/login',loginUser);

router.post('/passwordReset',getUserFromJWT,passwordReset);

router.post('/forgot_password',getUserFromJWT,generateResetToken);

router.post('/reset_password',getUserFromJWT,passwordResetWithToken);

router.route('/:id')
    .get(findUser)
    .patch(getUserFromJWT,verifyOwnership('id'),updateUser)
    .delete(getUserFromJWT,verifyOwnership('id'),deleteUser);





export default router;