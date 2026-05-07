import {
  Carrinho,
  ItemCarrinho,
  Produto,
  Restaurante,
} from "../models/index.js";

export async function listarCarrinho(req, res) {
  try {
    const usuarioId = req.auth.id_usuario;

    const carrinho = await Carrinho.findOne({
      where: { idUsuario: usuarioId },
      include: [
        {
          association: "restaurante",
        },
        {
          association: "itens",
          include: [
            {
              association: "produto_carrinho",
            },
          ],
        },
      ],
      order: [[{ model: ItemCarrinho, as: "itens" }, "id", "ASC"]],
    });

    if (!carrinho) {
      return res.json({
        itens: [],
        total: 0,
      });
    }

    const total = carrinho.itens.reduce((acc, item) => {
      return acc + Number(item.valor_unitario) * item.quantidade;
    }, 0);

    return res.json({
      ...carrinho.toJSON(),
      total,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao buscar carrinho.",
    });
  }
}

export async function adicionarItem(req, res) {
  try {
    const usuarioId = req.auth.id_usuario;

    const {
      idProduto,
      quantidade = 1,
      observacao,
    } = req.body;

    const produto = await Produto.findByPk(idProduto, {
      include: [
        {
          association: "menu",
          include: [
            {
              association: "restaurante",
            },
          ],
        },
      ],
    });

    if (!produto) {
      return res.status(404).json({
        message: "Produto não encontrado.",
      });
    }

    const restauranteId = produto.menu?.idRestaurante;

    if (!restauranteId) {
      return res.status(400).json({
        message: "Produto sem restaurante vinculado.",
      });
    }

    let carrinho = await Carrinho.findOne({
      where: {
        idUsuario: usuarioId,
      },
      include: [
        {
          association: "itens",
        },
      ],
    });

    /*
      REGRA:
      só pode existir UM restaurante por carrinho
    */

    if (
      carrinho &&
      Number(carrinho.idRestaurante) !== Number(restauranteId)
    ) {
      await ItemCarrinho.destroy({
        where: {
          idCarrinho: carrinho.id,
        },
      });

      await carrinho.update({
        idRestaurante: restauranteId,
      });
    }

    if (!carrinho) {
      carrinho = await Carrinho.create({
        idUsuario: usuarioId,
        idRestaurante: restauranteId,
        // compat: populate required commerce fields so legacy schema constraints pass
        idProduto: idProduto,
        quantidade: quantidade,
        valor_individual: produto.preco,
        idPedido: null,
      });
    }

    const itemExistente = await ItemCarrinho.findOne({
      where: {
        idCarrinho: carrinho.id,
        idProduto,
      },
    });

    if (itemExistente) {
      itemExistente.quantidade += Number(quantidade);

      await itemExistente.save();

      return res.json({
        message: "Quantidade do produto atualizada.",
        item: itemExistente,
      });
    }

    const novoItem = await ItemCarrinho.create({
      idCarrinho: carrinho.id,
      idProduto,
      quantidade,
      observacao: observacao ?? null,
      valor_unitario: produto.preco,
    });

    return res.status(201).json({
      message: "Produto adicionado ao carrinho.",
      item: novoItem,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao adicionar item ao carrinho.",
      error: String(error?.message ?? error),
    });
  }
}

export async function removerItem(req, res) {
  try {
    const usuarioId = req.auth.id_usuario;
    const itemId = Number(req.params.id);

    const carrinho = await Carrinho.findOne({
      where: {
        idUsuario: usuarioId,
      },
    });

    if (!carrinho) {
      return res.status(404).json({
        message: "Carrinho não encontrado.",
      });
    }

    const item = await ItemCarrinho.findOne({
      where: {
        id: itemId,
        idCarrinho: carrinho.id,
      },
    });

    if (!item) {
      return res.status(404).json({
        message: "Item não encontrado.",
      });
    }

    await item.destroy();

    return res.json({
      message: "Item removido do carrinho.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao remover item.",
    });
  }
}

export async function limparCarrinho(req, res) {
  try {
    const usuarioId = req.auth.id_usuario;

    const carrinho = await Carrinho.findOne({
      where: {
        idUsuario: usuarioId,
      },
    });

    if (!carrinho) {
      return res.json({
        message: "Carrinho já está vazio.",
      });
    }

    await ItemCarrinho.destroy({
      where: {
        idCarrinho: carrinho.id,
      },
    });

    return res.json({
      message: "Carrinho limpo com sucesso.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erro ao limpar carrinho.",
    });
  }
}