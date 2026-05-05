import { Router } from 'express';
import { atualizarPerfil, atualizarPerfisUsuario, atualizarStatusRestaurante, criarPerfil, listarPerfis, listarRestaurantes, listarUsuarios } from '../controllers/adminController.js';
import { atualizarCategoria, criarCategoria, excluirCategoria, listarCategorias } from '../controllers/categoriaController.js';
import { atualizarEntregador, criarEntregador, excluirEntregador, listarEntregadores } from '../controllers/entregadorController.js';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/admin/usuarios', authenticateToken, authorizeRoles('admin'), listarUsuarios);
router.get('/admin/perfis', authenticateToken, authorizeRoles('admin'), listarPerfis);
router.post('/admin/perfis', authenticateToken, authorizeRoles('admin'), criarPerfil);
router.patch('/admin/perfis/:id', authenticateToken, authorizeRoles('admin'), atualizarPerfil);
router.get('/admin/entregadores', authenticateToken, authorizeRoles('admin'), listarEntregadores);
router.post('/admin/entregadores', authenticateToken, authorizeRoles('admin'), criarEntregador);
router.patch('/admin/entregadores/:id', authenticateToken, authorizeRoles('admin'), atualizarEntregador);
router.delete('/admin/entregadores/:id', authenticateToken, authorizeRoles('admin'), excluirEntregador);
router.get('/admin/restaurantes', authenticateToken, authorizeRoles('admin'), listarRestaurantes);
router.get('/admin/categorias', authenticateToken, authorizeRoles('admin'), listarCategorias);
router.post('/admin/categorias', authenticateToken, authorizeRoles('admin'), criarCategoria);
router.patch('/admin/categorias/:id', authenticateToken, authorizeRoles('admin'), atualizarCategoria);
router.delete('/admin/categorias/:id', authenticateToken, authorizeRoles('admin'), excluirCategoria);
router.patch('/admin/restaurantes/:id/status', authenticateToken, authorizeRoles('admin'), atualizarStatusRestaurante);
router.patch('/admin/usuarios/:id/perfil', authenticateToken, authorizeRoles('admin'), atualizarPerfisUsuario);

export default router;
