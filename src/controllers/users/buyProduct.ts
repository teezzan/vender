import { Request, Response, NextFunction } from 'express';
import { getRepository, Repository } from 'typeorm';

import { Product } from 'typeorm/entities/Product';
import { CoinDenomination } from 'typeorm/entities/types';
import { User } from 'typeorm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const buyProduct = async (req: Request, res: Response, next: NextFunction) => {
  const buyerID = req.jwtPayload.id;
  const { productId, amountOfProduct } = req.body;

  const userRepository = getRepository(User);

  const productRepository = getRepository(Product);

  try {
    const user = await userRepository.findOne({ where: { id: buyerID } });

    if (!user) {
      const customError = new CustomError(404, 'General', `User not found.`, ['User not found.']);
      return next(customError);
    }

    const product = await productRepository.findOne({ where: { id: productId } });

    if (!product) {
      const customError = new CustomError(404, 'General', `Product not found.`, ['Product not found.']);
      return next(customError);
    }

    const seller = await userRepository.findOne({ where: { id: product.sellerId } });

    if (!seller) {
      const customError = new CustomError(404, 'General', `Seller User not found.`, ['Seller User not found.']);
      return next(customError);
    }
    const totalCost = amountOfProduct * product.cost;

    if (product.amountAvailable < amountOfProduct) {
      const customError = new CustomError(404, 'General', `Insufficient Product Quantity AVailable.`, [
        'Insufficient Product Quantity AVailable.',
      ]);
      return next(customError);
    }

    if (user.totalDeposit() < totalCost) {
      const customError = new CustomError(404, 'General', `Deposit Insufficient.`, ['Deposit Insufficient.']);
      return next(customError);
    }
    const updatedUser = await user.moveFunds(seller, totalCost, userRepository);

    product.amountAvailable = product.amountAvailable - amountOfProduct;
    const updatedProduct = await productRepository.save(product);

    res.customSuccess(200, 'Successful', {
      totalCost,
      product: updatedProduct,
      change: updatedUser.deposit,
    });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
