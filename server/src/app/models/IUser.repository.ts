import { PrismaClient, User } from "@prisma/client";
import { IUser ,ILogin, IRegister } from "./IUser";

export interface IUserRepository {
  _db: PrismaClient; 
  findUserByEmail(email:string): Promise<User | null> ;
  login(loginUser:ILogin): Promise<IUser>;
  register(registerUser:IRegister): Promise<IUser>;
}
