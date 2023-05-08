/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validator =
	(schema: Joi.ObjectSchema<any>) =>
	(req: Request, res: Response, next: NextFunction): any => {
		const validationValue = schema.validate(req.body, {
			abortEarly: false,
			allowUnknown: true,
			convert: false,
			skipFunctions: true,
		});
		if (validationValue.error) {
			const errorMessages = validationValue.error.details.map((error) => error.message);

			return res.status(422).json({ error: errorMessages });
		}

		return next();
	};

export { validator };
