import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 0,
  })
  amountAvailable: number;

  @Column({
    nullable: false,
  })
  cost: number;

  @Column({
    nullable: false,
  })
  productName: string;

  @Column()
  sellerId: number;

  @Column()
  @CreateDateColumn()
  created_at: Date;

  @Column()
  @UpdateDateColumn()
  updated_at: Date;
}
