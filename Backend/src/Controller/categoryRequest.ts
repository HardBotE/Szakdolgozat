import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";
import RequestModel from "../Model/categoryRequestModel";

const createOneCategoryRequest= createOne(RequestModel);

const findOneCategoryRequest= findOneById(RequestModel);

const findAllCategoryRequest= findAll(RequestModel);

const updateCategoryRequest= updateOneById(RequestModel);

const deleteOneCategoryRequest= deleteOneById(RequestModel);

export {createOneCategoryRequest,findAllCategoryRequest,findOneCategoryRequest,updateCategoryRequest,deleteOneCategoryRequest};