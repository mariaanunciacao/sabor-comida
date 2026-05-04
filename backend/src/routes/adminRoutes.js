import { Router } from 'express';
import { atualizarStatusRestaurante, listarEntregadores, listarPerfis, listarRestaurantes, listarUsuarios } from '../controllers/adminController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/admin/usuarios', authenticateToken, authorizeRoles('admin'), listarUsuarios);
router.get('/admin/perfis', authenticateToken, authorizeRoles('admin'), listarPerfis);
router.get('/admin/entregadores', authenticateToken, authorizeRoles('admin'), listarEntregadores);
router.get('/admin/restaurantes', authenticateToken, authorizeRoles('admin'), listarRestaurantes);
router.patch('/admin/restaurantes/:id/status', authenticateToken, authorizeRoles('admin'), atualizarStatusRestaurante);

export default router;
