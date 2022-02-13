import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { ConstsUser } from 'consts/ConstsUser';
import { CustomError } from 'utils/response/custom-error/CustomError';

const schema = Joi.object().keys({
  password: Joi.string().min(ConstsUser.PASSWORD_MIN_CHAR).required(),
  passwordNew: Joi.string().min(ConstsUser.PASSWORD_MIN_CHAR).required(),
});

export const validatorChangePassword = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  return next();
};
