import { Roles } from '../typeorm/entities/types';

export type JwtPayload = {
  id: number;
  username: string;
  role: Roles;
  created_at: Date;
};
