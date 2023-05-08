import express, { Response, Express } from 'express';
import { PrismaClient } from '@prisma/client';
import redisClient from './util/connectRedis';
import cors from 'cors';
import morgan from 'morgan';
import { applicationRouter } from './routes/application.router';

export class Application {
	private readonly _server: Express;
	private readonly prisma = new PrismaClient();

	constructor() {
		this._server = express();
		this._server.set('host', process.env.HOST || 'localhost');
		this._server.set('port', process.env.PORT || 6000);
		this._server.use(express.json());
		this._server.use(express.urlencoded({ extended: true }));
		this._server.use(cors());
		this._server.use(morgan('dev'));
		this._server.use("/api",applicationRouter);
	}

	public bootstrap = async (): Promise<void> => {
		this._server.get('/api/healthchecker', async (_, res: Response) => {
			const message = await redisClient.get('try');
			res.status(200).json({
				status: 'success',
				message,
			});
		});
	};

	public startServer(): void {
		const host: string = this._server.get('host');
		const port: number = this._server.get('port');
		this._server.listen(port, host, () => {
			console.log(`Server started at http://${host}:${port}`);
			this.bootstrap()
				.catch((err) => {
					throw err;
				})
				.finally(async () => {
					await this.prisma.$disconnect();
				});
		});
	}
}
