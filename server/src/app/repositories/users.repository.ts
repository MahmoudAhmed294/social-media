import { PrismaClient, User } from '@prisma/client';
import { IUserRepository } from '../models/IUser.repository';
import { IUser, ILogin, IRegister } from '../models/IUser';
import { Unauthorized, Forbidden, InternalServerError } from 'http-errors';
import AuthHelpers from '../helpers/authHelpers';

const prisma = new PrismaClient();

export class UserRepository implements IUserRepository {
	readonly _db: PrismaClient;

	constructor() {
		this._db = prisma;
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const user = await this._db.user.findUnique({
			where: {
				email,
			},
		});
		return user || null;
	}

	async login(loginUser: ILogin): Promise<IUser> {
		try {
			const { email, password } = loginUser;

			const user = await this.findUserByEmail(email);

			if (!user) {
				throw Unauthorized('User does not exist');
			}

			const checkPassword = await AuthHelpers.isPasswordValid(user.password, password);

			if (!checkPassword) {
				throw Unauthorized('invalid login credentials, please check your email or password');
			}

			const token = await AuthHelpers.generateToken({ userId: user.id });
			user.password = '';

			if (!user) throw Unauthorized('invalid login credentials, please check your email or password');

			return {
				id: user.id,
				username: user.username,
				name: user.name,
				email: user.email,
				gender: user.gender,
				token: token,
			};
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error);
			throw error.message;
		}
	}

	async register(registerUser: IRegister): Promise<IUser> {
		try {
			const { email, password, gender, name, username } = registerUser;

			const checkUser = await this.findUserByEmail(email);

			if (checkUser) {
				throw Forbidden('user with this email address exists');
			}

			const hashPassword = await AuthHelpers.hashPassword(password);

			const user = await this._db.user.create({
				data: {
					email,
					name,
					gender,
					password: hashPassword,
					username,
				},
			});

			if (!user) {
				throw InternalServerError("Unable to save user's data");
			}

			const token = await AuthHelpers.generateToken({ userId: user.id });

			return {
				id: user.id,
				username: user.username,
				name: user.name,
				email: user.email,
				gender: user.gender,
				token: token,
			};

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error);
			throw error.message;
		}
	}
}
