import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
} from 'typeorm';
import { User } from './User';
import { Category } from './Category';

@Entity('budgets')
@Unique(['userId', 'categoryId'])
export class Budget {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    userId: string;

    @Column({ type: 'uuid' })
    categoryId: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    // Relationships
    @ManyToOne(() => User, (user) => user.budgets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Category, (category) => category.budgets, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;
}
