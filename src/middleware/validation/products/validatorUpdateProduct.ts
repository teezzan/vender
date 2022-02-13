import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { getRepository } from 'typeorm';

import { Product } from 'typeorm/entities/Product';
import { CustomError } from 'utils/response/custom-error/CustomError';

const schema = Joi.object().keys({
  productName: Joi.string().min(3).optional(),
  cost: Joi.number().integer().positive().multiple(5).optional(),
  amount: Joi.number().integer().positive().optional().allow(0).default(0),
});

export const validatorUpdateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const payload = req.body;
  const { error } = schema.validate(payload);

  if (error !== undefined) {
    const customError = new CustomError(400, 'Validation', error.message, null, null, null);
    return next(customError);
  }

  const productRepository = getRepository(Product);

  const product = await productRepository.findOne({ productName: payload.productName });

  if (product) {
    const customError = new CustomError(400, 'Validation', 'Edit user validation error', null, null, [
      { username: `Product '${payload.productName}' already exists` },
    ]);
    return next(customError);
  }

  return next();
};
