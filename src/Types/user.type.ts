
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "client" | "coach";
    sub_type:'normal'|'premium';
}

export  {IUser};