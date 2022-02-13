import { Roles } from '../typeorm/entities/users/types';

export type JwtPayload = {
  id: number;
  username: string;
  role: Roles;
  created_at: Date;
};
