import { Request, Response } from 'express';
import { UserRepository } from '../repositories/users.repository';

export class UsersController {
  private readonly _repository: UserRepository;

  constructor(private repository: UserRepository) {
    this._repository = this.repository;
  }

  async register(request: Request, response: Response) {
    
    return this._repository
      .register(request.body)
      .then((users) => response.status(200).send(users))
      .catch((error) => response.status(500).send({ error: error }));
  }

  async login(request: Request, response: Response) {
    
    return this._repository
      .login(request.body)
      .then((users) => response.status(200).send(users))
      .catch((error) => response.status(500).send({ error: error }));
  }
}



