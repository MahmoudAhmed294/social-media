import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { Unauthorized } from 'http-errors';
import { NextFunction, Response, Request } from 'express';
import { CustomRequest } from '../models/IApi';

class AuthHelpers {
	async hashPassword(password: string): Promise<string> {
		if (!password) throw new Error('Error hashing password');

		const slat = bcrypt.genSaltSync(10);

		return bcrypt.hashSync(password, slat);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async generateToken(payload: any): Promise<string> {
		const secret: string | undefined = process.env.ACCESS_TOKEN_SECRET;

		if (!secret) throw new Error('Error generate token');

		return Jwt.sign(payload, secret, { expiresIn: '6h' });
	}

	async isPasswordValid(hashedPass: string, plainPass: string): Promise<boolean> {
		return bcrypt.compareSync(plainPass, hashedPass);
	}

	mustBeLoggedIn(req: Request, res: Response, next: NextFunction): void {
		try {
			const token = req.headers.authorization;
			if (!token) {
				throw Unauthorized('unauthorized access: Token not found');
			}
			if (!token.split(' ')[0]) {
				throw Unauthorized('invalid token type: provide a Bearer token');
			}
			if (!req.headers.authorization) {
				throw Unauthorized('provide a authorization token');
			}

			const authToken = req.headers.authorization.split(' ')[1];

			const ACCESS_TOKEN: string | undefined = process.env.ACCESS_TOKEN_SECRET;

			if (!ACCESS_TOKEN) throw new Error('Error to gettoken');

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const decoded = Jwt.verify(authToken, ACCESS_TOKEN);

			(req as unknown as CustomRequest).token = decoded;

			next();
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			res.status(error.status || 500).json({
				status: false,
				message: 'Sorry, you must provide a valid token.',
				error,
			});
		}
	}
}

export default new AuthHelpers();
