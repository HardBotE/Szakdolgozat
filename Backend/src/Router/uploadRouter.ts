import express, {NextFunction,Request,Response} from "express";
import {updateModelWithFile, upload} from "../Utils/multerConfig";
import {getUserFromJWT} from "../Controller/authController";
import {AppError} from "../Utils/AppError";

const router = express.Router();



router.post('/:file_path/:id?',getUserFromJWT, (req:Request, res:Response, next:NextFunction) => {
    console.log("Inside router.post");
    console.log("Params:", req.params);
    console.log("File path:", req.params.file_path);
    console.log("ID:", req.params);
    const { file_path,id } = req.params;

    if(file_path==='profile_pictures')
        { // @ts-ignore
            req.uploadType=req.user.id;
        }

    if(file_path==='category_backgrounds' || file_path==='session_files')
        { // @ts-ignore
            req.uploadType=id;
        }

    // @ts-ignore
    if(!req.uploadType)
        return next(new AppError('Unable to upload here',403,'You have to upload file in the correct path.'));


    upload(file_path).single('file')(req, res, (err) => {
        if (err) {
            return next(new AppError(err.message, 400, "File upload failed"));
        }
        next();
    });

},updateModelWithFile);

export default router;
