import { Router } from 'express';
import {
    adicionarAoCarrinho,
    alternarFavorito,
    avaliacoesDoRestaurante,
    criarAvaliacao,
    finalizarPedido,
    historicoPedidos,
    listarCarrinho,
    listarFavoritos,
    removerDoCarrinho,
    statusDoPedido,
} from '../controllers/commerceController.js';

const router = Router();

router.get('/usuarios/:usuarioId/carrinho', listarCarrinho);
router.post('/usuarios/:usuarioId/carrinho', adicionarAoCarrinho);
router.delete('/usuarios/:usuarioId/carrinho/:carrinhoId', removerDoCarrinho);

router.get('/usuarios/:usuarioId/pedidos', historicoPedidos);
router.post('/pedidos/checkout', finalizarPedido);
router.get('/pedidos/:pedidoId/status', statusDoPedido);
router.post('/pedidos/:pedidoId/avaliacoes', criarAvaliacao);

router.get('/restaurantes/:restauranteId/avaliacoes', avaliacoesDoRestaurante);

router.get('/usuarios/:usuarioId/favoritos', listarFavoritos);
router.post('/usuarios/:usuarioId/favoritos', alternarFavorito);
router.delete('/usuarios/:usuarioId/favoritos/:restauranteId', alternarFavorito);

export default router;