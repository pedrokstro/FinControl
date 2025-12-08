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

// Debug: Log da configuração
console.log('🔍 Database Config:', {
  hasUrl: Boolean(process.env.DATABASE_URL),
  isPooler: isUsingPooler,
  urlPreview: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 50) + '...' : 'none'
});

// Configuração explícita para pooler
const poolerConfig = isUsingPooler ? {
  host: 'aws-1-us-east-1.pooler.supabase.com',
  port: 5432,
  username: 'postgres.hzazlkgpamawlqmvxyii',
  password: 'YZAP2IMKvmE0S2lU',
  database: 'postgres',
} : {};

console.log('🔧 Connection Config:', {
  usingPooler: isUsingPooler,
  host: isUsingPooler ? poolerConfig.host : 'from URL or config',
  username: isUsingPooler ? poolerConfig.username : 'from URL or config',
  port: isUsingPooler ? poolerConfig.port : 'from URL or config'
});

const connectionConfig = isUsingPooler ? {
  type: 'postgres' as const,
  host: poolerConfig.host,
  port: poolerConfig.port,
  username: poolerConfig.username,
  password: poolerConfig.password,
  database: poolerConfig.database,
} : {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL || undefined,
  host: process.env.DATABASE_URL ? undefined : config.db.host,
  port: process.env.DATABASE_URL ? undefined : config.db.port,
  username: process.env.DATABASE_URL ? undefined : config.db.username,
  password: process.env.DATABASE_URL ? undefined : (config.db.password || undefined),
  database: process.env.DATABASE_URL ? undefined : config.db.database,
};

export const AppDataSource = new DataSource({
  ...connectionConfig,
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
  // Configurações de pool para produção
  poolSize: 10,
  connectTimeoutMS: 30000,
  extra: {
    // Configurar timezone para UTC
    timezone: 'UTC',
    // Pool de conexões otimizado para Supabase pooler
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
    query_timeout: 30000,
    statement_timeout: 30000,
    // Keepalive para manter conexões ativas
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
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
