import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'typeorm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const resetUserDeposit = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.jwtPayload.id;
  const { username } = req.body;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, 'General', `User not found.`, ['User not found.']);
      return next(customError);
    }

    user.deposit = [];

    try {
      await userRepository.save(user);
      res.customSuccess(200, 'Users Deposit successfully Reset.');
    } catch (err) {
      const customError = new CustomError(409, 'Raw', `User '${user.username}' can't be reset.`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
