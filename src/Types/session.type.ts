import mongoose from "mongoose";

interface ISession  extends Document {
    client_id: mongoose.Schema.Types.ObjectId;
    coach_id: mongoose.Schema.Types.ObjectId;
    date: string;
    status:'pending'|'paid'|'not_paid'|'canceled';
}

export {ISession};