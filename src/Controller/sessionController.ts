import sessionModel from "../Model/sessionModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";

const createSession = createOne(sessionModel);

const updateSession=updateOneById(sessionModel,['id','_id','user_id','coach_id']);

const findOneSession=findOneById(sessionModel);

const findAllSession=findAll(sessionModel);

const deleteSession= deleteOneById(sessionModel);


export {createSession,updateSession,findOneSession,deleteSession,findAllSession};