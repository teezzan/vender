import e from 'cors';
import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { CoinDenomination } from 'typeorm/entities/types';
import { User } from 'typeorm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const depositCoin = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.jwtPayload.id;
  const { coin } = req.body;

  const coinType = parseInt(CoinDenomination[coin]);

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, 'General', `User not found.`, ['User not found.']);
      return next(customError);
    }

    const index = user.deposit.findIndex((coin) => coin.denomination == coinType);
    if (index == -1) {
      user.deposit.push({
        denomination: coinType,
        quantity: 1,
      });
    } else {
      user.deposit[index].quantity = user.deposit[index].quantity + 1;
    }

    try {
      const updatedUser = await userRepository.save(user);
      res.customSuccess(200, 'Coin Deposited successfully.', {
        deposit: updatedUser.deposit,
        total: updatedUser.totalDeposit(),
      });
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `Coin '${coin}' can't be saved.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
