
import categoryModel from "../Model/categoryModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";

const createOneCategory= createOne(categoryModel);

const findOneCategory= findOneById(categoryModel);

const findAllCategory= findAll(categoryModel);

const updateCategory= updateOneById(categoryModel);

const deleteOneCategory= deleteOneById(categoryModel);

export {createOneCategory,findAllCategory,findOneCategory,updateCategory,deleteOneCategory};
