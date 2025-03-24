
import {deleteUser, findAllUsers, findUser, returnCoachName, updateUser} from "../Controller/userController";
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



router.post('/register',signUpUser);

router.post('/login',loginUser);

router.post('/logout',logOut);
router.post('/forgot_password',generateResetToken);
router.post('/passwordReset',getUserFromJWT,passwordReset);


router.post('/reset_password',passwordResetWithToken);

router.route('/me').get(getUserFromJWT,(req:Request, res:Response) => {

    res.status(200).send({
        message:'Succesfully retrived data',

        user:req.user,
    })
});

router.route('/:id')
    .get(findUser)
    .patch(getUserFromJWT,updateUser)
    .delete(getUserFromJWT,verifyOwnership('id'),deleteUser);





export default router;