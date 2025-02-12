import express from "express";
import {
    createOneCategory,
    deleteOneCategory,
    findAllCategory,
    findOneCategory,
    updateCategory
} from "../Controller/categoryController";
import {createCoach, deleteCoach, findAllCoaches, findCoach, updateCoach} from "../Controller/coachController";


const router=express.Router();

router.route('/')
    .get(findAllCategory)
    .post(createOneCategory);

router.route('/:category_id')
    .get(findOneCategory)
    .put(updateCategory)
    .delete(deleteOneCategory);

router.route('/:category_id/coaches')
    .get(findAllCoaches)
    .post(createCoach);

router.route('/:category_id/coaches/:coach_id')
    .get(findCoach)
    .patch(updateCoach)
    .delete(deleteCoach);



export default router;