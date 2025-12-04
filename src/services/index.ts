// Exportar todos os services
export { default as authService } from './auth.service';
export { default as userService } from './user.service';
export { default as categoryService } from './category.service';
export { default as transactionService } from './transaction.service';
export { default as dashboardService } from './dashboard.service';

// Exportar tipos
export type { LoginCredentials, RegisterData, AuthResponse } from './auth.service';
export type { User, UpdateProfileData, ChangePasswordData } from './user.service';
export type { Category, CreateCategoryData } from './category.service';
export type { Transaction, CreateTransactionData, TransactionFilters } from './transaction.service';
export type { DashboardData, DashboardSummary, CategorySummary } from './dashboard.service';
