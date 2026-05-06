import { Router } from 'express';
import { listarPedidosRestaurante, alterarStatusPedido, atribuirEntregador } from '../controllers/restaurantePedidosController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import restauranteAprovado from '../middlewares/restauranteAprovado.js';

const router = Router();

router.get('/restaurantes/meu/pedidos', authenticateToken, restauranteAprovado, listarPedidosRestaurante);
router.patch('/restaurantes/meu/pedidos/:id/status', authenticateToken, restauranteAprovado, alterarStatusPedido);
router.post('/restaurantes/meu/pedidos/:id/atribuir-entregador', authenticateToken, restauranteAprovado, atribuirEntregador);

export default router;
