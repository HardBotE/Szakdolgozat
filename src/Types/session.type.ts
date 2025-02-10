
interface ISession  extends Document {
    client_id: string;
    coach_id: string;
    date: string;
    status:'pending'|'paid'|'not_paid'|'canceled';
}