import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'typeorm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.jwtPayload.id;

  const userRepository = getRepository(User);
  try {
    const raw_user = await userRepository.findOne(id);
    const user = raw_user.publifyUser();

    if (!user) {
      const customError = new CustomError(404, 'General', `User with id:${id} not found.`, ['User not found.']);
      return next(customError);
    }
    res.customSuccess(200, 'Success', user);
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
