import { Router } from 'express';
import { listarProdutos, criarProduto, atualizarProduto, excluirProduto } from '../controllers/restauranteMenuController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import restauranteAprovado from '../middlewares/restauranteAprovado.js';

const router = Router();

router.get('/restaurantes/meu/produtos', authenticateToken, restauranteAprovado, listarProdutos);
router.post('/restaurantes/meu/produtos', authenticateToken, restauranteAprovado, criarProduto);
router.put('/restaurantes/meu/produtos/:id', authenticateToken, restauranteAprovado, atualizarProduto);
router.delete('/restaurantes/meu/produtos/:id', authenticateToken, restauranteAprovado, excluirProduto);

export default router;
