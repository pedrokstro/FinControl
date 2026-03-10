import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Transaction } from './Transaction';

@Entity('credit_cards')
export class CreditCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  limit: number;

  @Column({ type: 'integer' })
  closingDay: number; // Dia de fechamento da fatura

  @Column({ type: 'integer' })
  dueDay: number; // Dia de vencimento

  @Column({ type: 'varchar', length: 20, default: 'Visa' })
  brand: string; // Visa, Mastercard, etc.

  @Column({ type: 'uuid' })
  userId: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.creditCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.creditCard)
  transactions: Transaction[];
}
