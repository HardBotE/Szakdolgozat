import userModel from "../Model/userModel";
import { deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";



const findAllUsers=findAll(userModel);

const findUser=findOneById(userModel);

const updateUser=updateOneById(userModel,['role','password','sub_type','_id']);

const deleteUser=deleteOneById(userModel);

const returnCoachName=findOneById(userModel);

export {findAllUsers,findUser,updateUser,deleteUser,returnCoachName};