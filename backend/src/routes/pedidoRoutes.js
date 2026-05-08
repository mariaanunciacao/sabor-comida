import { Router } from "express";

import {
  criarPedido,
  listarPedidosRestaurante,
  atualizarStatusPedido,
  listarPedidosUsuario,
} from "../controllers/pedidoController.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

/*
  CLIENTE
*/

router.post(
  "/pedidos",
  authenticateToken,
  criarPedido
);

router.get(
  "/meus-pedidos",
  authenticateToken,
  listarPedidosUsuario
);

/*
  RESTAURANTE
*/

router.get(
  "/restaurante/pedidos",
  authenticateToken,
  listarPedidosRestaurante
);

router.patch(
  "/pedidos/:id/status",
  authenticateToken,
  atualizarStatusPedido
);

export default router;