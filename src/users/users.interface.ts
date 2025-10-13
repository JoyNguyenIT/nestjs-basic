export interface IUser {
    _id: string,
    email: string,
    name: string,
    role: string,
}


export interface IUserCreate {
    _id: string,
    email: string,
    name: string,
    age: number,
    password: string,
    gender: string,
    address: string,
    role: string,
    company: {
        _id: string,
        name: string
    }
}