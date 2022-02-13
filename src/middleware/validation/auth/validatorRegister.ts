import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { ConstsUser } from 'consts/ConstsUser';
import { CustomError } from 'utils/response/custom-error/CustomError';

const schema = Joi.object().keys({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(ConstsUser.PASSWORD_MIN_CHAR).required(),
  isSeller: Joi.boolean().optional().default(false),
});

export const validatorRegister = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  return next();
};
