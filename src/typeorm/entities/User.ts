import bcrypt from 'bcryptjs';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { Role, Language, Roles, CoinDenomination } from './types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.Buyer,
  })
  role: Roles;

  @Column({
    type: 'jsonb',
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  deposit: Array<{ denomination: CoinDenomination; number: number }>;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfPasswordMatch(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
  publifyUser() {
    return {
      username: this.username,
      role: Roles[this.role],
      deposit: this.deposit,
    };
  }
}
