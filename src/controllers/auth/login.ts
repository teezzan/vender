import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Roles } from 'typeorm/entities/types';
import { User } from 'typeorm/entities/User';
import { JwtPayload } from 'types/JwtPayload';
import { createJwtToken } from 'utils/createJwtToken';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  const userRepository = getRepository(User);
  try {
    const user = await userRepository.findOne({ where: { username } });

    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect username or password']);
      return next(customError);
    }

    if (!user.checkIfPasswordMatch(password)) {
      const customError = new CustomError(404, 'General', 'Not Found', ['Incorrect username or password']);
      return next(customError);
    }

    const jwtPayload: JwtPayload = {
      id: user.id,
      username: user.username,
      role: user.role as Roles,
      created_at: user.created_at,
    };

    try {
      const token = createJwtToken(jwtPayload);
      res.customSuccess(200, 'Token successfully created.', `Bearer ${token}`);
    } catch (err) {
      const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
      return next(customError);
    }
  } catch (err) {
    const customError = new CustomError(400, 'Raw', 'Error', null, err);
    return next(customError);
  }
};
