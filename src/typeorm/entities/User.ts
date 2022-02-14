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

import { Roles, CoinDenomination } from './types';

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
    this.deposit.sort((a, b) => a.denomination - b.denomination).reverse();

    this.deposit.forEach((cointype, index) => {
      if (amount != 0) {
        let numOfCoin = Math.floor(amount / cointype.denomination);
        if (numOfCoin >= cointype.quantity) {
          numOfCoin = cointype.quantity;
        }
        amount = amount - numOfCoin * cointype.denomination;
        this.deposit[index].quantity = cointype.quantity - numOfCoin;
        const c_index = this.deposit.findIndex((coin) => coin.denomination == cointype.denomination);
        if (c_index != -1) {
          sinkUser.deposit[c_index].quantity += numOfCoin;
        } else {
          sinkUser.deposit.push({
            denomination: cointype.denomination,
            quantity: numOfCoin,
          });
        }
      }
    });
    if (amount != 0) {
      return { source: null, sink: null, err: new Error('Deficit of ' + amount + 'cent remaining. Aborting!') };
    } else {
      const source = await userRepository.save(this);
      const sink = await userRepository.save(sinkUser);
      return { source, sink, err: null };
    }
  }
}
