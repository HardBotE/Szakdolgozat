import express from "express";
import {
    createOneCategoryRequest, deleteOneCategoryRequest,
    findAllCategoryRequest,
    findOneCategoryRequest,
    updateCategoryRequest
} from "../Controller/categoryRequest";

const router=express.Router();

router.route('/')
    .get(findAllCategoryRequest)
    .post(createOneCategoryRequest);

router.route('/:id')
    .get(findOneCategoryRequest)
    .patch(updateCategoryRequest)
    .delete(deleteOneCategoryRequest);

export default router;