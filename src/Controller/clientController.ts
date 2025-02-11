import clientModel from "../Model/clientModel";
import {createOne, deleteOneById, findAll, findOneById, updateOneById} from "./FactoryController";


const findOneClient =findOneById(clientModel);

const findAllClients=findAll(clientModel);

const createClient =createOne(clientModel);

const updateClient=updateOneById(clientModel);

const deleteClient=deleteOneById(clientModel);

