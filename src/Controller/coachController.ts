import coachModel from "../Model/coachModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";

const findAllCoaches=findAll(coachModel);

const findCoach=findOneById(coachModel);

const createCoach=createOne(coachModel);

const updateCoach=updateOneById(coachModel,['id','_id','user_id']);

const deleteCoach=deleteOneById(coachModel);

export {findAllCoaches,findCoach,createCoach,updateCoach,deleteCoach};