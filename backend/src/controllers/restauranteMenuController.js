import { Produto, Menu, Categoria } from '../models/index.js';

function numeric(v) {
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
}

async function buscarOuCriarMenu(restauranteId) {
  let menu = await Menu.findOne({
    where: {
      idRestaurante: restauranteId,
    },
  });

  if (!menu) {
    menu = await Menu.create({
      nome_menu: 'Cardápio Principal',
      descricao: 'Cardápio do restaurante',
      idRestaurante: restauranteId,
    });
  }

  return menu;
}

export const listarProdutos = async (req, res) => {
  try {
    const restauranteId = req.restaurante.id;

    const menu = await buscarOuCriarMenu(restauranteId);

    const produtos = await Produto.findAll({
      where: {
        idMenu: menu.id,
      },
      include: [
        {
          model: Categoria,
          as: 'categoria',
        },
      ],
      order: [['id', 'ASC']],
    });

    return res.json(produtos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao listar produtos.',
    });
  }
};

export const criarProduto = async (req, res) => {
  try {
    const restauranteId = req.restaurante.id;

    const {
      nome_produto,
      descricao,
      preco,
      ingredientes,
      imagem_path,
      ativo,
      idCategoria,
    } = req.body;

    const menu = await buscarOuCriarMenu(restauranteId);

    const produto = await Produto.create({
      nome_produto,
      descricao,
      preco,
      ingredientes,
      imagem_path: imagem_path ?? null,
      ativo: ativo ?? true,
      idCategoria,
      idMenu: menu.id,
    });

    return res.status(201).json({
      message: 'Produto criado com sucesso.',
      produto,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao criar produto.',
    });
  }
};

export const atualizarProduto = async (req, res) => {
  try {
    const restauranteId = req.restaurante.id;

    const produtoId = numeric(req.params.id);

    if (!produtoId) {
      return res.status(400).json({
        message: 'Produto inválido.',
      });
    }

    const menu = await buscarOuCriarMenu(restauranteId);

    const produto = await Produto.findOne({
      where: {
        id: produtoId,
        idMenu: menu.id,
      },
    });

    if (!produto) {
      return res.status(404).json({
        message: 'Produto não encontrado.',
      });
    }

    const {
      nome_produto,
      descricao,
      preco,
      ingredientes,
      imagem_path,
      ativo,
      idCategoria,
    } = req.body;

    await produto.update({
      nome_produto,
      descricao,
      preco,
      ingredientes,
      imagem_path,
      ativo,
      idCategoria,
    });

    return res.json({
      message: 'Produto atualizado com sucesso.',
      produto,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao atualizar produto.',
    });
  }
};

export const excluirProduto = async (req, res) => {
  try {
    const restauranteId = req.restaurante.id;

    const produtoId = numeric(req.params.id);

    if (!produtoId) {
      return res.status(400).json({
        message: 'Produto inválido.',
      });
    }

    const menu = await buscarOuCriarMenu(restauranteId);

    const produto = await Produto.findOne({
      where: {
        id: produtoId,
        idMenu: menu.id,
      },
    });

    if (!produto) {
      return res.status(404).json({
        message: 'Produto não encontrado.',
      });
    }

    await produto.destroy();

    return res.json({
      message: 'Produto excluído com sucesso.',
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erro ao excluir produto.',
    });
  }
};