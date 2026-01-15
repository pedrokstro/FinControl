import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import bcrypt from 'bcryptjs';
import { Category } from './Category';
import { Transaction } from './Transaction';
import { RefreshToken } from './RefreshToken';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role: string;

  // Premium Plan Fields
  @Column({ type: 'varchar', length: 20, default: 'free' })
  planType: 'free' | 'premium';

  @Column({ type: 'timestamp', nullable: true })
  planStartDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  planEndDate: Date | null;

  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @Column({ type: 'boolean', default: false })
  isTrial: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googlePayTransactionId: string | null;

  // Google Play Billing Fields
  @Column({ type: 'varchar', length: 500, nullable: true })
  googlePlayPurchaseToken: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  googlePlaySubscriptionId: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  googlePlayOrderId: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  subscriptionStatus: 'active' | 'canceled' | 'expired' | 'revoked' | null;

  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @Column({ type: 'varchar', length: 10, default: 'light' })
  theme: 'light' | 'dark' | 'system';

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens: RefreshToken[];

  // Methods
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && !this.password.startsWith('$2a$')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Premium Plan Methods
  isPlanActive(): boolean {
    if (this.planType === 'free') return false;
    if (!this.planEndDate) return false;
    return new Date() < new Date(this.planEndDate);
  }

  hasFeatureAccess(feature: string): boolean {
    // Premium features
    const premiumFeatures = [
      'advanced_emojis',
      'custom_categories',
      'advanced_reports',
      'export_unlimited',
      'priority_support',
      'unlimited_transactions',
      'export_reports',
      'export_data',
      'calculators',
    ];

    if (premiumFeatures.includes(feature)) {
      return this.isPlanActive();
    }

    // Free features
    return true;
  }

  // Plan limits
  static readonly FREE_PLAN_TRANSACTION_LIMIT = 10;
  static readonly PREMIUM_PLAN_TRANSACTION_LIMIT = -1; // Unlimited

  toJSON(): Partial<User> {
    const { password, ...user } = this;
    return {
      ...user,
      isPremium: this.isPlanActive(),
    };
  }
}
