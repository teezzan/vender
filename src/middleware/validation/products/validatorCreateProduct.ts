import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { CustomError } from 'utils/response/custom-error/CustomError';

const schema = Joi.object().keys({
  productName: Joi.string().min(3).required(),
  cost: Joi.number().integer().positive().multiple(5).required(),
  amount: Joi.number().integer().positive().optional().default(0),
});

export const validatorCreateProduct = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  return next();
};
