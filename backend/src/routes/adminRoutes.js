import { Router } from 'express';
import { listarEntregadores, listarPerfis, listarUsuarios } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/admin/usuarios', authenticateToken, authorizeRoles('admin'), listarUsuarios);
router.get('/admin/perfis', authenticateToken, authorizeRoles('admin'), listarPerfis);
router.get('/admin/entregadores', authenticateToken, authorizeRoles('admin'), listarEntregadores);

export default router;
