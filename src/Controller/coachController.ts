import coachModel from "../Model/coachModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";

const findAllCoaches=findAll(coachModel);

const findCoach=findOneById(coachModel);

const createCoach=createOne(coachModel);

const updateCoach=updateOneById(coachModel);

const deleteCoach=deleteOneById(coachModel);
