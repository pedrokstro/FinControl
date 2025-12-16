import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export enum RecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @Column({ 
    type: 'varchar',
    length: 10,
    comment: 'Data no formato YYYY-MM-DD'
  })
  date: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @Column({ type: 'uuid' })
  userId: string;

  // Recurring transaction fields
  @Column({ type: 'boolean', default: false })
  isRecurring: boolean;

  @Column({
    type: 'enum',
    enum: RecurrenceType,
    nullable: true,
  })
  recurrenceType: RecurrenceType | null;

  @Column({ type: 'timestamp', nullable: true })
  recurrenceEndDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  nextOccurrence: Date | null;

  @Column({ type: 'uuid', nullable: true })
  parentTransactionId: string | null;

  // Installments fields (novos campos opcionais)
  @Column({ type: 'integer', nullable: true, comment: 'Número total de parcelas (null = infinito ou usa recurrenceEndDate)' })
  totalInstallments?: number | null;

  @Column({ type: 'integer', nullable: true, default: 1, comment: 'Parcela atual' })
  currentInstallment?: number | null;

  @Column({ type: 'boolean', default: false, comment: 'Recorrência cancelada' })
  isCancelled?: boolean;

  @Column({ type: 'timestamp', nullable: true, comment: 'Data de cancelamento' })
  cancelledAt?: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Category, (category) => category.transactions, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;
}
