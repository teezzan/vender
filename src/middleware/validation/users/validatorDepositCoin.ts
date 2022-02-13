import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

import { CoinDenomination } from 'typeorm/entities/types';
import { CustomError } from 'utils/response/custom-error/CustomError';

const coinEnumWithoutValues = Object.keys(CoinDenomination).filter((x) => !(parseInt(x) >= 0));

const schema = Joi.object().keys({
  coin: Joi.string()
    .valid(...coinEnumWithoutValues)
    .required(),
});

export const validatorDepositCoin = (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  return next();
};
