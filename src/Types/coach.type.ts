
interface ICoach extends Document {
    user_id: string;
    category_id: string;
    description: string;
    rating: number;
    price: number;
}

export {ICoach};