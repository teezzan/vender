import bcrypt from 'bcryptjs';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Transaction,
  TransactionRepository,
  Repository,
} from 'typeorm';

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
  deposit: Array<{ denomination: number; quantity: number }>;

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
  totalDeposit() {
    let totalDeposit = 0;
    this.deposit.forEach((coin) => {
      totalDeposit += coin.denomination * coin.quantity;
    });
    return totalDeposit;
  }

  @Transaction()
  async moveFunds(sinkUser: User, amount: number, @TransactionRepository(User) userRepository: Repository<User>) {
    const coinType = CoinDenomination.Ten;
    const index = this.deposit.findIndex((coin) => coin.denomination == coinType);

    this.deposit[index].quantity = this.deposit[index].quantity - 1;
    sinkUser.deposit.push({
      denomination: coinType,
      quantity: 1,
    });

    const p1 = await userRepository.save(this);
    const p2 = await userRepository.save(sinkUser);
    return p1;
  }
}
