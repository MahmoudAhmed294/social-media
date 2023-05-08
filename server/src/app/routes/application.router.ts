import express, { Router } from 'express';
import { usersRouter } from './users.router';

const router: Router = express.Router();
router.use('/auth', usersRouter);

export const applicationRouter: Router = router;
