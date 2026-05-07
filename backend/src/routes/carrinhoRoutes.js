import { Router } from "express";

import {
  listarCarrinho,
  adicionarItem,
  removerItem,
  limparCarrinho,
} from "../controllers/carrinhoController.js";

import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.get(
  "/carrinho",
  authenticateToken,
  listarCarrinho
);

router.post(
  "/carrinho/adicionar",
  authenticateToken,
  adicionarItem
);

router.delete(
  "/carrinho/item/:id",
  authenticateToken,
  removerItem
);

router.delete(
  "/carrinho/limpar",
  authenticateToken,
  limparCarrinho
);

export default router;