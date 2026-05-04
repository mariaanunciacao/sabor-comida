import { Router } from 'express';
import { listarRestaurantes, listarRestaurantePorId, meuRestaurante, atualizarMeuRestaurante } from '../controllers/restauranteController.js';
import { authenticateToken, authorizeRoles, authorizeRestaurantOwnership } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/restaurantes', listarRestaurantes);
router.get('/restaurantes/:id', listarRestaurantePorId);
router.get('/restaurantes/meu', authenticateToken, authorizeRoles('restaurante'), authorizeRestaurantOwnership, meuRestaurante);
router.put('/restaurantes/meu', authenticateToken, authorizeRoles('restaurante'), authorizeRestaurantOwnership, atualizarMeuRestaurante);

export default router;