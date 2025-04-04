
interface IUser{

    "_id":string,
    "name": string,
    "role": string,
    "sub_type": string,
    "email": string,
    "coachId"?: string,
    "picture": string | ''
}

export type {IUser};
