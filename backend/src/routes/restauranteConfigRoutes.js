import { Router } from 'express';
import { atualizarRestaurante } from '../controllers/restauranteConfigController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import restauranteAprovado from '../middlewares/restauranteAprovado.js';

const router = Router();

router.put('/restaurantes/meu/config', authenticateToken, restauranteAprovado, atualizarRestaurante);

export default router;
