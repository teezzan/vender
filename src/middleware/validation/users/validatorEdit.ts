import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { getRepository } from 'typeorm';

import { User } from 'typeorm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';
import { ErrorValidation } from 'utils/response/custom-error/types';

const schema = Joi.object().keys({
  username: Joi.string().min(3).required(),
});

export const validatorEdit = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  const userRepository = getRepository(User);

  const user = await userRepository.findOne({ username: payload.username });
  if (user) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, [
      { username: `Username '${payload.username}' already exists` },
    ]);
    return next(customError);
  }

  return next();
};
