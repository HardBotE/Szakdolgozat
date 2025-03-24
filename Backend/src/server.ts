import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import app from "./app"; // Express app beimportálása

dotenv.config({ path: "./config.env" });

const server = http.createServer(app);

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception: 💣💣💣 ", err);
});

const db = String(process.env.DATABASE_URL).replace("<db_password>", process.env.DATABASE_PASSWORD);

mongoose
    .connect(db, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("✅ Connected to database successfully!"))
    .catch((err) => console.error("💣 Database Connection Error: ", err));


const PORT: number = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
    console.log(`🚀 REST API szerver fut: http://localhost:${PORT}`);
});

import './websocket';
