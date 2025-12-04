-- ================================================
-- FINCONTROL - SCHEMA COMPLETO DO BANCO DE DADOS
-- Database: MySQL 8.0+
-- ================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS fincontrol_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fincontrol_db;

-- ================================================
-- TABELA: users
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500) NULL,
  isActive BOOLEAN DEFAULT TRUE,
  role VARCHAR(50) DEFAULT 'user',
  planType VARCHAR(20) DEFAULT 'free',
  planStartDate TIMESTAMP NULL,
  planEndDate TIMESTAMP NULL,
  isPremium BOOLEAN DEFAULT FALSE,
  googlePayTransactionId VARCHAR(255) NULL,
  subscriptionStatus VARCHAR(50) NULL,
  isAdmin BOOLEAN DEFAULT FALSE,
  theme VARCHAR(10) DEFAULT 'light',
  emailVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- TABELA: categories
-- ================================================
CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('income', 'expense') NOT NULL,
  color VARCHAR(7) NOT NULL DEFAULT '#3b82f6',
  icon VARCHAR(50) NOT NULL DEFAULT '💰',
  userId VARCHAR(36) NOT NULL,
  isDefault BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_type (userId, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- TABELA: transactions
-- ================================================
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(36) PRIMARY KEY,
  type ENUM('income', 'expense') NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  categoryId VARCHAR(36) NOT NULL,
  userId VARCHAR(36) NOT NULL,
  isRecurring BOOLEAN DEFAULT FALSE,
  recurrenceType ENUM('daily', 'weekly', 'monthly', 'yearly') NULL,
  recurrenceEndDate DATE NULL,
  parentTransactionId VARCHAR(36) NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parentTransactionId) REFERENCES transactions(id) ON DELETE CASCADE,
  INDEX idx_user_date (userId, date),
  INDEX idx_user_type (userId, type),
  INDEX idx_category (categoryId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- TABELA: savings_goals
-- ================================================
CREATE TABLE IF NOT EXISTS savings_goals (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  targetAmount DECIMAL(10, 2) NOT NULL,
  currentAmount DECIMAL(10, 2) DEFAULT 0,
  month INT NOT NULL,
  year INT NOT NULL,
  description TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_month_year (userId, month, year),
  INDEX idx_user_period (userId, year, month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- TABELA: refresh_tokens
-- ================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(36) PRIMARY KEY,
  token TEXT NOT NULL,
  userId VARCHAR(36) NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (userId),
  INDEX idx_expires (expiresAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- TABELA: verification_codes
-- ================================================
CREATE TABLE IF NOT EXISTS verification_codes (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(50) NOT NULL,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_type (email, type),
  INDEX idx_expires (expiresAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- TABELA: notifications
-- ================================================
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  isRead BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_read (userId, isRead),
  INDEX idx_created (createdAt)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- DADOS INICIAIS (OPCIONAL)
-- ================================================

-- Categorias padrão de Receitas
-- INSERT INTO categories (id, name, type, color, icon, userId, isDefault) VALUES
-- (UUID(), 'Salário', 'income', '#10b981', '💼', 'SYSTEM', TRUE),
-- (UUID(), 'Freelance', 'income', '#3b82f6', '💻', 'SYSTEM', TRUE),
-- (UUID(), 'Investimentos', 'income', '#8b5cf6', '📈', 'SYSTEM', TRUE);

-- Categorias padrão de Despesas
-- INSERT INTO categories (id, name, type, color, icon, userId, isDefault) VALUES
-- (UUID(), 'Alimentação', 'expense', '#ef4444', '🍔', 'SYSTEM', TRUE),
-- (UUID(), 'Transporte', 'expense', '#f59e0b', '🚗', 'SYSTEM', TRUE),
-- (UUID(), 'Moradia', 'expense', '#06b6d4', '🏠', 'SYSTEM', TRUE),
-- (UUID(), 'Saúde', 'expense', '#ec4899', '🏥', 'SYSTEM', TRUE),
-- (UUID(), 'Educação', 'expense', '#6366f1', '📚', 'SYSTEM', TRUE),
-- (UUID(), 'Lazer', 'expense', '#14b8a6', '🎮', 'SYSTEM', TRUE);

-- ================================================
-- FIM DO SCHEMA
-- ================================================
