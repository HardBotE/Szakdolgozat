import express from "express";
import {
    createOneCategory,
    deleteOneCategory,
    findAllCategory,
    findOneCategory,
    updateCategory
} from "../Controller/categoryController";
import {createCoach, findAllCoaches} from "../Controller/coachController";



const router=express.Router();

router.route('/')
    .get(findAllCategory)
    .post(createOneCategory);

router.route('/:category_id')
    .get(findOneCategory)
    .put(updateCategory)
    .delete(deleteOneCategory);

router.route("/:category_id/coaches")
    .get(findAllCoaches)
    .post(createCoach);





export default router;