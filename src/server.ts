import * as mongoose from "mongoose";


import dotenv from "dotenv";
dotenv.config({path: "./config.env"});
import  app from "./app";


process.on("uncaughtException", (err) => {
    console.log("Uncaught Exception: 💣💣💣 ", err);
});

const db=String(process.env.DATABASE_URL).replace('<db_password>',process.env.DATABASE_PASSWORD);

mongoose.connect(db).then(() => {
    console.log("Connected to server successfully!");}).catch((err)=>{
        console.log('Database Error! 💣💣💣 ', err);
});

const port:number = Number(process.env.PORT) || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});