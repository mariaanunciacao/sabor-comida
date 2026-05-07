import { Router } from 'express';
import { listarRestaurantes, listarRestaurantePorId, meuRestaurante, statusMeuRestaurante, atualizarMeuRestaurante } from '../controllers/restauranteController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/restaurantes', listarRestaurantes);
router.get('/restaurantes/meu', authenticateToken, meuRestaurante);
router.get('/restaurantes/meu/status', authenticateToken, statusMeuRestaurante);
router.put('/restaurantes/meu', authenticateToken, atualizarMeuRestaurante);
router.get('/restaurantes/:id', listarRestaurantePorId);

export default router;