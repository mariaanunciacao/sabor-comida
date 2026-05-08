import {
  Pedido,
  ItemPedido,
  Carrinho,
  ItemCarrinho,
  Produto,
  Endereco,
  StatusPedido,
  Entregador,
  Restaurante,
  Usuario,
} from "../models/index.js";

/*
|--------------------------------------------------------------------------
| CRIAR PEDIDO
|--------------------------------------------------------------------------
*/

export async function criarPedido(
  req,
  res
) {
  try {
    const usuarioId =
      req.auth.id_usuario;

    const {
      endereco,
      formaPagamento,
      observacao,
    } = req.body;

    /*
      VALIDAR ENDEREÇO
    */

    if (
      !endereco ||
      !endereco.cep ||
      !endereco.logradouro ||
      !endereco.numero ||
      !endereco.cidade ||
      !endereco.estado
    ) {
      return res.status(400).json({
        message:
          "Endereço inválido.",
      });
    }

    /*
      BUSCAR CARRINHO
    */

    const carrinho =
      await Carrinho.findOne({
        where: {
          idUsuario:
            usuarioId,
        },

        include: [
          {
            association:
              "itens",

            include: [
              {
                association:
                  "produto_carrinho",
              },
            ],
          },
        ],
      });

    if (!carrinho) {
      return res.status(404).json({
        message:
          "Carrinho não encontrado.",
      });
    }

    if (
      !carrinho.itens.length
    ) {
      return res.status(400).json({
        message:
          "Carrinho vazio.",
      });
    }

    /*
      TOTAL
    */

    const total =
      carrinho.itens.reduce(
        (acc, item) => {
          return (
            acc +
            Number(
              item.valor_unitario
            ) *
              item.quantidade
          );
        },
        0
      );

    /*
      CRIAR ENDEREÇO
    */

    const novoEndereco =
      await Endereco.create({
        cep: endereco.cep,
        logradouro:
          endereco.logradouro,
        numero:
          endereco.numero,
        cidade:
          endereco.cidade,
        estado:
          endereco.estado,
        idUsuario:
          usuarioId,
      });

    /*
      STATUS INICIAL
    */

    const statusInicial =
      await StatusPedido.findOne(
        {
          where: {
            situacao:
              "Recebido",
          },
        }
      );

    if (!statusInicial) {
      return res.status(500).json({
        message:
          "Status inicial não encontrado.",
      });
    }

    /*
      PAGAMENTO TEMPORÁRIO
    */

    const idPagamento = 1;

    /*
      CRIAR PEDIDO
    */

    const pedido =
      await Pedido.create({
        observacao:
          observacao ??
          null,

        idRestaurante:
          carrinho.idRestaurante,

        idPagamento,

        idEndereco:
          novoEndereco.id,

        idPessoa:
          usuarioId,

        idStatusPedido:
          statusInicial.id,
      });

    /*
      ITENS PEDIDO
    */

    for (const item of carrinho.itens) {
      await ItemPedido.create({
        idPedido:
          pedido.id,

        idProduto:
          item.idProduto,

        quantidade:
          item.quantidade,

        valor_unitario:
          item.valor_unitario,

        observacao:
          item.observacao ??
          null,
      });
    }

    /*
      LIMPAR CARRINHO
    */

    await ItemCarrinho.destroy({
      where: {
        idCarrinho:
          carrinho.id,
      },
    });

    return res.status(201).json({
      message:
        "Pedido criado com sucesso.",

      pedidoId:
        pedido.id,

      total,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao criar pedido.",

      error: String(
        error?.message ??
          error
      ),
    });
  }
}

/*
|--------------------------------------------------------------------------
| RESTAURANTE
| LISTAR PEDIDOS
|--------------------------------------------------------------------------
*/

export async function listarPedidosRestaurante(
  req,
  res
) {
  try {
    const restauranteId =
      req.auth.id_restaurante;

    const pedidos =
      await Pedido.findAll({
        where: {
          idRestaurante:
            restauranteId,
        },

        include: [
          {
            association:
              "status_pedido",
          },

          {
            association:
              "enderecos",
          },

          {
            association:
              "pessoas",
          },

          {
            association:
              "entregadores",
          },

          {
            association:
              "itens_pedido",

            include: [
              {
                association:
                  "produtos",
              },
            ],
          },
        ],

        order: [
          [
            "created_at",
            "DESC",
          ],
        ],
      });

    return res.json(pedidos);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao buscar pedidos.",
    });
  }
}

/*
|--------------------------------------------------------------------------
| ALTERAR STATUS
|--------------------------------------------------------------------------
*/

export async function atualizarStatusPedido(
  req,
  res
) {
  try {
    const pedidoId =
      req.params.id;

    const {
      idStatusPedido,
    } = req.body;

    const pedido =
      await Pedido.findByPk(
        pedidoId
      );

    if (!pedido) {
      return res.status(404).json({
        message:
          "Pedido não encontrado.",
      });
    }

    /*
      SE FOR:
      "SAIU PARA ENTREGA"

      SORTEIA ENTREGADOR
    */

    if (
      Number(
        idStatusPedido
      ) === 4
    ) {
      const entregadores =
        await Entregador.findAll();

      if (
        entregadores.length >
        0
      ) {
        const entregadorAleatorio =
          entregadores[
            Math.floor(
              Math.random() *
                entregadores.length
            )
          ];

        pedido.idEntregador =
          entregadorAleatorio.id;
      }
    }

    pedido.idStatusPedido =
      idStatusPedido;

    await pedido.save();

    return res.json({
      message:
        "Status atualizado.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao atualizar status.",
    });
  }
}

/*
|--------------------------------------------------------------------------
| CLIENTE
| LISTAR PEDIDOS
|--------------------------------------------------------------------------
*/

export async function listarPedidosUsuario(
  req,
  res
) {
  try {
    const usuarioId =
      req.auth.id_usuario;

    const pedidos =
      await Pedido.findAll({
        where: {
          idPessoa:
            usuarioId,
        },

        include: [
          {
            association:
              "status_pedido",
          },

          {
            association:
              "restaurantes",
          },

          {
            association:
              "enderecos",
          },

          {
            association:
              "entregadores",
          },

          {
            association:
              "itens_pedido",

            include: [
              {
                association:
                  "produtos",
              },
            ],
          },
        ],

        order: [
          [
            "created_at",
            "DESC",
          ],
        ],
      });

    /*
      TOTAL PEDIDO
    */

    const pedidosFormatados =
      pedidos.map(
        (pedido) => {
          const total =
            pedido.itens_pedido.reduce(
              (
                acc,
                item
              ) => {
                return (
                  acc +
                  Number(
                    item.valor_unitario
                  ) *
                    item.quantidade
                );
              },
              0
            );

          return {
            ...pedido.toJSON(),
            total,
          };
        }
      );

    return res.json(
      pedidosFormatados
    );
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erro ao buscar pedidos.",
    });
  }
}