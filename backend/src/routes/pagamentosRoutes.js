import { Router } from 'express';
import { listarPagamentos, marcarComoPago } from '../controllers/pagamentoController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import restauranteAprovado from '../middlewares/restauranteAprovado.js';

const router = Router();

router.get('/restaurantes/meu/pagamentos', authenticateToken, restauranteAprovado, listarPagamentos);
router.patch('/restaurantes/meu/pagamentos/:id/pagar', authenticateToken, restauranteAprovado, marcarComoPago);

export default router;
