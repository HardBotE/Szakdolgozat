import multer, { FileFilterCallback } from "multer";
import path from "path";
import {NextFunction, Request} from "express";
import SessionModel from "../Model/sessionModel";
import CategoryModel from "../Model/categoryModel";
import UserModel from "../Model/userModel";


const storage = (filePath: string,) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/${filePath}`);
        },
        filename: function (req, file, cb) {
            let naming='';
            let type='';
            if(req.session_files)
            {
                naming=req.session_files;
                type='session';
            }
            if(req.background)
            {
                naming=req.background;
                type='category';
            }

            if(req.profile){
                naming=req.profile;
                type='profile';
            }

            req.uploadedData=naming;
            req.naming=file.fieldname + '-' +naming + path.extname(file.originalname).toLowerCase();
            cb(null, req.naming);
        },
    });
};


const fileFilter = (filePath: string) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        const imageTypes = /\.(jpg|jpeg|png|gif)$/;
        const docTypes = /\.(pdf|doc|docx)$/;


        if (filePath === 'category_backgrounds' || filePath === 'profile_pictures') {
            if (!file.originalname.match(imageTypes)) {
                return cb(new Error('Only image files are allowed.'));
            }
        } else if (filePath === 'session_files') {
            if (!file.originalname.match(docTypes)) {
                return cb(new Error('Only PDF and DOC/DOCX files are allowed.'));
            }
        } else {
            return cb(new Error('Invalid upload path.'));
        }

        cb(null, true);
    };
};

const upload = (filePath: string) => {
    return multer({
        storage: storage(filePath),
        limits: { fileSize: 10000000 }, // 10MB
        fileFilter: fileFilter(filePath),
    });
};

export { storage, upload };
