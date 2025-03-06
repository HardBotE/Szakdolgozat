import * as mongoose from "mongoose";


import dotenv from "dotenv";
dotenv.config({path: "./config.env"});

import { createServer } from "http";
import { Server } from "socket.io";
import app from "./app";

const server = createServer(app);
const io = new Server(server);
//amikor a frontenden meg lesz csinalva a websocket, a felhasznalo csatlakozasnal jwt szerint azonositva lesz,
//jwt utan az uzeneteket lekerjuk
//messagen emitelni minden felhasznalonak es kozben lementi az uzenetet az adatbazisba.
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("disconnect", (reason) => {
        console.log(`User disconnected: ${socket.id}, Reason: ${reason}`);
    });

    socket.on("test_message", (msg) => {
        console.log("Received message:", msg);
        socket.emit("response", "Message received!");
    });


});
io.on("error", (err) => {
    console.log('Socket Error: ', err);
})
process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: 💣💣💣 ", err);
});

const db=String(process.env.DATABASE_URL).replace('<db_password>',process.env.DATABASE_PASSWORD);

mongoose.connect(db,{serverSelectionTimeoutMS:5000,}).then(() => {
    console.log("Connected to server successfully!");}).catch((err)=>{
        console.log('Database Error! 💣💣💣 ', err);
});

const port:number = Number(process.env.PORT) || 3000;

server.listen(port, () => {
    console.log(`Listening on port ${port}`);

});






