import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { CustomError } from 'utils/response/custom-error/CustomError';

const schema = Joi.object().keys({
  amount: Joi.number().integer().positive().required().allow(0).default(0),
});

export const validatorRestockProduct = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  return next();
};
