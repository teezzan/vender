import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Product } from 'typeorm/entities/Product';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.jwtPayload.id;

  const productRepository = getRepository(Product);
  try {
    const products = await productRepository.find({});

    res.customSuccess(200, 'Success', products);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
