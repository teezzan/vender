import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Product } from 'typeorm/entities/Product';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  const { productName, cost, amount } = req.body;
  const sellerId = req.jwtPayload.id;

  const productRepository = getRepository(Product);
  try {
    const product = await productRepository.findOne({ where: { productName, sellerId } });

    if (product) {
      const customError = new CustomError(400, 'General', 'product already exists in your catalog', [
        `Product Name '${product.productName}' already exists in your catalog`,
      ]);
      return next(customError);
    }

    try {
      const newproduct = new Product();
      newproduct.cost = cost;
      newproduct.productName = productName;
      newproduct.amountAvailable = amount;
      newproduct.sellerId = sellerId;

      const savedProject = await productRepository.save(newproduct);

      res.customSuccess(201, 'Product successfully created.', savedProject);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `Product '${productName}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
