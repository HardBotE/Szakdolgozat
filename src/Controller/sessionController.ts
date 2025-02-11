import sessionModel from "../Model/sessionModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";

const createSession = createOne(sessionModel);

const updateSession=updateOneById(sessionModel);

const findOneSession=findOneById(sessionModel);

const findAllSession=findAll(sessionModel);

const deleteSession= deleteOneById(sessionModel);


