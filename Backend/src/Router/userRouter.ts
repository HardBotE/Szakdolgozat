
import {deleteUser, findAllUsers, findUser, updateUser} from "../Controller/userController";
import {
    getUserFromJWT,
    grantPermission,
    loginUser,
    signUpUser,
    verifyOwnership,
    passwordReset,
    generateResetToken, passwordResetWithToken, logOut
} from "../Controller/authController";
import {Request,Response} from "express";
import express from "express";

const router=express.Router();

router.route('/')
    .get(findAllUsers);

router.route('/me').get(getUserFromJWT,(req:Request, res:Response) => {

    res.status(200).send({
        message:'Succesfully retrived data',

        user:req.user,
    })
});

router.post('/register',signUpUser);

router.post('/login',loginUser);

router.post('/logout',logOut);

router.post('/passwordReset',getUserFromJWT,passwordReset);

router.post('/forgot_password',getUserFromJWT,generateResetToken);

router.post('/reset_password',getUserFromJWT,passwordResetWithToken);

router.route('/:id')
    .get(findUser)
    .patch(getUserFromJWT,verifyOwnership('id'),updateUser)
    .delete(getUserFromJWT,verifyOwnership('id'),deleteUser);





export default router;