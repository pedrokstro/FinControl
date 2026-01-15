import { Router } from 'express';
import { authenticate } from '@/middlewares/auth.middleware';
import { checkExportReports, checkExportData } from '@/middlewares/checkPremiumFeature';
import { exportController } from '@/controllers/export.controller';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticate);

/**
 * @route   POST /api/export/reports
 * @desc    Exportar relatórios (PDF/Excel/CSV) - Premium only
 * @access  Private (Premium)
 */
router.post('/reports', checkExportReports, exportController.exportReports);

/**
 * @route   POST /api/export/data
 * @desc    Exportar todos os dados do usuário (JSON) - Premium only
 * @access  Private (Premium)
 */
router.post('/data', checkExportData, exportController.exportData);

export default router;
