import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";


const storage = (filePath: string,) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, `public/${filePath}`);
        },
        filename: function (req, file, cb) {
            let naming='';
            if(req.session_files)
                naming=req.session_files;
            if(req.background)
                naming=req.background;
            if(req.profile)
                naming=req.profile;
            cb(null, file.fieldname + '-' +naming +'-'+ Date.now() + path.extname(file.originalname).toLowerCase());
        }
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
