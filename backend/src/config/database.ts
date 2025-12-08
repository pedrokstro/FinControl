import { DataSource } from 'typeorm';
import { config } from './env';
import { User } from '@/models/User';
import { Category } from '@/models/Category';
import { Transaction } from '@/models/Transaction';
import { RefreshToken } from '@/models/RefreshToken';
import { UserPreference } from '@/entities/UserPreference';
import { VerificationCode } from '@/entities/VerificationCode';
import { Notification } from '@/models/Notification';

const shouldUseSsl = Boolean(process.env.DATABASE_URL);
const isUsingPooler = process.env.DATABASE_URL?.includes('pooler.supabase.com');

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : config.db.host,
  port: process.env.DATABASE_URL ? undefined : config.db.port,
  username: process.env.DATABASE_URL ? undefined : config.db.username,
  password: process.env.DATABASE_URL ? undefined : (config.db.password || undefined),
  database: process.env.DATABASE_URL ? undefined : config.db.database,
  synchronize: false, // DESABILITADO - Usar migrations
  logging: config.nodeEnv === 'development',
  entities: [User, Category, Transaction, RefreshToken, UserPreference, VerificationCode, Notification],
  migrations: config.nodeEnv === 'production' 
    ? ['dist/database/migrations/**/*.js'] 
    : ['src/database/migrations/**/*.ts'],
  migrationsRun: false, // Migrations rodadas via script separado
  subscribers: [],
  ssl: (shouldUseSsl || process.env.NODE_ENV === 'production' || isUsingPooler)
    ? { rejectUnauthorized: false }
    : false,
  extra: {
    // Configurar timezone para UTC
    timezone: 'UTC',
    // Forçar IPv4 para evitar problemas de conexão no Render
    ...(process.env.NODE_ENV === 'production' && {
      connectionTimeoutMillis: 10000,
      query_timeout: 10000,
    }),
  },
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established successfully');
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    process.exit(1);
  }
};
