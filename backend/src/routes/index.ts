import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import categoryRoutes from './category.routes';
import transactionRoutes from './transaction.routes';
import dashboardRoutes from './dashboard.routes';
import subscriptionRoutes from './subscription.routes';
import userPreferenceRoutes from './userPreference.routes';
import savingsGoalRoutes from './savingsGoal.routes';
import notificationRoutes from './notification.routes';
import adminRoutes from './admin.routes';
import analyticsRoutes from './analytics.routes';

const router = Router();

// Rotas da API
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/transactions', transactionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/user-preferences', userPreferenceRoutes);
router.use('/savings-goals', savingsGoalRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
