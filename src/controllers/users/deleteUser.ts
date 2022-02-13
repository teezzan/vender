import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from 'typeorm/entities/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.jwtPayload.id;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', [`User with id:${id} doesn't exists.`]);
      return next(customError);
    }
    userRepository.delete(id);

    res.customSuccess(200, 'User successfully deleted.', { id: user.id, username: user.username });
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
