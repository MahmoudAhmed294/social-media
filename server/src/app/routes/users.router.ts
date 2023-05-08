import express, { Request, Response, Router } from 'express';
import { UsersController } from '../controllers';
import { UserRepository } from '../repositories/users.repository';
import { IUserRepository } from '../models/IUser.repository';

const router: Router = express.Router();
const usersRepository: IUserRepository = new UserRepository();

const controller: UsersController = new UsersController(usersRepository);

router.post('/register', async (request: Request, response: Response) => {
  await controller.register(request, response);
});

router.post('/login', async (request: Request, response: Response) => {
  await controller.login(request, response);
});

export const usersRouter: Router = router;
