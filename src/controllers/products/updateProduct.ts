import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Product } from 'typeorm/entities/Product';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.id;
  const { productName, amount, cost } = req.body;
  const sellerId = req.jwtPayload.id;

  const productRepository = getRepository(Product);
  try {
    const product = await productRepository.findOne({ where: { id, sellerId } });

    if (!product) {
      const customError = new CustomError(404, 'General', `Product not found.`, ['Product not found.']);
      return next(customError);
    }
    if (productName) product.productName = productName;
    if (cost) product.cost = cost;
    if (amount) product.amountAvailable = amount;
    try {
      await productRepository.save(product);

      res.customSuccess(200, 'Product successfully updated.');
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `Product '${productName}' can't be updated`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
