interface IMessage extends Document {
    client_id: string;
    coach_id: string;
    message: string;
    timestamp: string;
}