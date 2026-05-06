import { Produto, Menu } from '../models/index.js';

function numeric(v) {
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

export const listarProdutos = async (req, res) => {
  const restauranteId = req.restaurante.id;

  const produtos = await Produto.findAll({
    include: [{ model: Menu, as: 'menu' }],
    order: [['id', 'ASC']],
  });

  // filter by restaurante
  const meus = produtos.filter((p) => p.menu?.idRestaurante === restauranteId);
  res.json(meus);
};

export const criarProduto = async (req, res) => {
  const restauranteId = req.restaurante.id;
  const { nome_produto, descricao, preco, ingredientes, imagem_path, ativo, idCategoria, idMenu } = req.body;

  const menu = await Menu.findByPk(idMenu);
  if (!menu || menu.idRestaurante !== restauranteId) {
    return res.status(400).json({ message: 'Menu inválido para este restaurante.' });
  }

  const produto = await Produto.create({
    nome_produto,
    descricao,
    preco,
    ingredientes,
    imagem_path: imagem_path ?? null,
    ativo: ativo ?? true,
    idCategoria,
    idMenu,
  });

  res.status(201).json({ message: 'Produto criado.', produto });
};

export const atualizarProduto = async (req, res) => {
  const restauranteId = req.restaurante.id;
  const produtoId = numeric(req.params.id);
  if (!produtoId) return res.status(400).json({ message: 'Produto inválido.' });

  const produto = await Produto.findByPk(produtoId, { include: [{ model: Menu, as: 'menu' }] });
  if (!produto || produto.menu?.idRestaurante !== restauranteId) {
    return res.status(404).json({ message: 'Produto não encontrado para este restaurante.' });
  }

  const payload = { ...req.body };
  // prevent changing menu to another restaurant's menu
  if (payload.idMenu) {
    const menu = await Menu.findByPk(payload.idMenu);
    if (!menu || menu.idRestaurante !== restauranteId) {
      return res.status(400).json({ message: 'Menu inválido para este restaurante.' });
    }
  }

  await produto.update(payload);
  res.json({ message: 'Produto atualizado.', produto });
};

export const excluirProduto = async (req, res) => {
  const restauranteId = req.restaurante.id;
  const produtoId = numeric(req.params.id);
  if (!produtoId) return res.status(400).json({ message: 'Produto inválido.' });

  const produto = await Produto.findByPk(produtoId, { include: [{ model: Menu, as: 'menu' }] });
  if (!produto || produto.menu?.idRestaurante !== restauranteId) {
    return res.status(404).json({ message: 'Produto não encontrado para este restaurante.' });
  }

  await produto.destroy();
  res.json({ message: 'Produto excluído.' });
};
