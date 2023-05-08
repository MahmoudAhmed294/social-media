export interface ILogin {
	email: string;
	password: string;
}
export interface IRegister extends ILogin {
	gender: string;
	name: string;
	username: string;
}
export interface IUser  {
    token: string;
    id: number;
    name: string;
    email: string;
    gender: string;
    username: string;
}
