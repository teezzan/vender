import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { CustomError } from 'utils/response/custom-error/CustomError';

const schema = Joi.object().keys({
  productId: Joi.number().integer().required(),
  amountOfProduct: Joi.number().integer().positive().required(),
});

export const validatorBuyProduct = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  return next();
};
