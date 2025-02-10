
interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "client" | "coach";
}

export  {IUser};