import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Roles } from 'typeorm/entities/types';
import { User } from 'typeorm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password, isSeller } = req.body;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { username } });

    if (user) {
      const customError = new CustomError(400, 'General', 'User already exists', [
        `Username '${user.username}' already exists`,
      ]);
      return next(customError);
    }

    try {
      const newUser = new User();
      newUser.username = username;
      newUser.password = password;
      newUser.hashPassword();
      if (isSeller) newUser.role = Roles.Seller;
      await userRepository.save(newUser);

      res.customSuccess(200, 'User successfully created.');
    } catch (err) {
      const customError = new CustomError(400, 'Raw', `User '${username}' can't be created`, null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
