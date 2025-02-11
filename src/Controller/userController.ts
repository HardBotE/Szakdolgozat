import userModel from "../Model/userModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";

const createUser=createOne(userModel);

const findAllUsers=findAll(userModel);

const findUser=findOneById(userModel);

const updateUser=updateOneById(userModel);

const deleteUser=deleteOneById(userModel);