import { Op } from 'sequelize';
import {
    Avaliacao,
    Carrinho,
    Categoria,
    Cupom,
    Endereco,
    Favorito,
    Menu,
    Pagamento,
    Pedido,
    Produto,
    Restaurante,
    StatusPagamento,
    StatusPedido,
    TipoPagamento,
    Usuario,
    sequelize,
} from '../models/index.js';

function toInteger(value) {
    const numberValue = Number(value);
    return Number.isInteger(numberValue) ? numberValue : null;
}

function toQuantity(value) {
    const numberValue = Number(value ?? 1);
    return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
}

function calcularTotal(items) {
    return items.reduce((total, item) => total + Number(item.valor_individual) * Number(item.quantidade), 0);
}

async function carregarPedidoCompleto(pedidoId) {
    return Pedido.findByPk(pedidoId, {
        include: [
            { model: Restaurante, as: 'restaurantes', include: [{ model: Categoria, as: 'categorias', through: { attributes: [] } }] },
            { model: StatusPedido, as: 'status_pedido' },
            { model: Pagamento, as: 'pagamentos' },
            { model: Cupom, as: 'cupons' },
            { model: Endereco, as: 'enderecos' },
            { model: Carrinho, as: 'carrinhos', include: [{ model: Produto, as: 'produto', include: [{ model: Menu, as: 'menu' }] }] },
            { model: Avaliacao, as: 'avaliacoes' },
        ],
    });
}

export async function listarCarrinho(req, res) {
    const usuarioId = toInteger(req.params.usuarioId ?? req.query.usuarioId);
    const restauranteId = toInteger(req.query.restauranteId ?? req.params.restauranteId);

    if (!usuarioId || !restauranteId) {
        return res.status(400).json({ message: 'Informe usuarioId e restauranteId.' });
    }

    const itens = await Carrinho.findAll({
        where: {
            idUsuario: usuarioId,
            idRestaurante: restauranteId,
            idPedido: { [Op.is]: null },
        },
        include: [
            { model: Produto, as: 'produto', include: [{ model: Menu, as: 'menu' }] },
            { model: Restaurante, as: 'restaurante' },
        ],
        order: [['created_at', 'ASC']],
    });

    return res.json({ itens, total: calcularTotal(itens) });
}

export async function adicionarAoCarrinho(req, res) {
    const usuarioId = toInteger(req.params.usuarioId ?? req.body.usuarioId);
    const restauranteId = toInteger(req.body.restauranteId ?? req.query.restauranteId);
    const produtoId = toInteger(req.body.produtoId);
    const quantidade = toQuantity(req.body.quantidade);

    if (!usuarioId || !restauranteId || !produtoId || !quantidade) {
        return res.status(400).json({ message: 'Informe usuarioId, restauranteId, produtoId e quantidade válida.' });
    }

    const produto = await Produto.findByPk(produtoId, {
        include: [
            { model: Menu, as: 'menu', include: [{ model: Restaurante, as: 'restaurante' }] },
            { model: Categoria, as: 'categoria' },
        ],
    });

    if (!produto || produto.menu?.idRestaurante !== restauranteId) {
        return res.status(404).json({ message: 'Produto não encontrado para este restaurante.' });
    }

    const itemExistente = await Carrinho.findOne({
        where: {
            idUsuario: usuarioId,
            idRestaurante: restauranteId,
            idProduto: produtoId,
            idPedido: { [Op.is]: null },
        },
    });

    if (itemExistente) {
        itemExistente.quantidade += quantidade;
        itemExistente.valor_individual = produto.preco;
        await itemExistente.save();

        return res.status(200).json({ message: 'Item atualizado no carrinho.', item: itemExistente });
    }

    const item = await Carrinho.create({
        idUsuario: usuarioId,
        idRestaurante: restauranteId,
        idProduto: produtoId,
        quantidade,
        valor_individual: produto.preco,
    });

    return res.status(201).json({ message: 'Item adicionado ao carrinho.', item });
}

export async function removerDoCarrinho(req, res) {
    const usuarioId = toInteger(req.params.usuarioId);
    const carrinhoId = toInteger(req.params.carrinhoId);

    if (!usuarioId || !carrinhoId) {
        return res.status(400).json({ message: 'Informe usuarioId e carrinhoId válidos.' });
    }

    const item = await Carrinho.findOne({ where: { id: carrinhoId, idUsuario: usuarioId, idPedido: { [Op.is]: null } } });

    if (!item) {
        return res.status(404).json({ message: 'Item do carrinho não encontrado.' });
    }

    await item.destroy();

    return res.status(200).json({ message: 'Item removido do carrinho.' });
}

export async function finalizarPedido(req, res) {
    const usuarioId = toInteger(req.body.usuarioId);
    const restauranteId = toInteger(req.body.restauranteId);
    const idTipoPagamento = toInteger(req.body.idTipoPagamento);
    const idCupom = req.body.idCupom ? toInteger(req.body.idCupom) : null;
    const enderecoId = req.body.enderecoId ? toInteger(req.body.enderecoId) : null;
    const tipoEntrega = String(req.body.tipoEntrega ?? 'delivery').trim().toLowerCase();
    const observacao = String(req.body.observacao ?? '').trim() || null;
    const enderecoNovo = req.body.endereco ?? null;

    if (!usuarioId || !restauranteId || !idTipoPagamento) {
        return res.status(400).json({ message: 'Informe usuarioId, restauranteId e idTipoPagamento.' });
    }

    const itensCarrinho = await Carrinho.findAll({
        where: {
            idUsuario: usuarioId,
            idRestaurante: restauranteId,
            idPedido: { [Op.is]: null },
        },
    });

    if (!itensCarrinho.length) {
        return res.status(400).json({ message: 'O carrinho está vazio.' });
    }

    const usuario = await Usuario.findByPk(usuarioId, { include: [{ model: Endereco, as: 'enderecos' }] });
    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const restaurante = await Restaurante.findByPk(restauranteId);
    if (!restaurante) {
        return res.status(404).json({ message: 'Restaurante não encontrado.' });
    }

    const tipoPagamento = await TipoPagamento.findByPk(idTipoPagamento);
    if (!tipoPagamento) {
        return res.status(404).json({ message: 'Tipo de pagamento inválido.' });
    }

    const statusPedidoRecebido = await StatusPedido.findOne({ where: { situacao: 'Recebido' } });
    const statusPagamentoPendente = await StatusPagamento.findOne({ where: { situacao: 'Pendente' } });
    if (!statusPedidoRecebido || !statusPagamentoPendente) {
        return res.status(500).json({ message: 'Status inicial indisponível.' });
    }

    if (idCupom) {
        const cupom = await Cupom.findByPk(idCupom);
        if (!cupom) {
            return res.status(404).json({ message: 'Cupom não encontrado.' });
        }
    }

    let enderecoPedido = null;

    if (tipoEntrega !== 'retirada' && tipoEntrega !== 'pickup') {
        if (enderecoId) {
            enderecoPedido = await Endereco.findOne({ where: { id: enderecoId, idUsuario: usuarioId } });
        } else if (enderecoNovo) {
            enderecoPedido = await Endereco.create({
                ...enderecoNovo,
                idUsuario: usuarioId,
            });
        } else if (usuario.enderecos?.length) {
            enderecoPedido = usuario.enderecos[0];
        } else {
            return res.status(400).json({ message: 'Informe um endereço para finalizar o pedido.' });
        }
    }

    const resultado = await sequelize.transaction(async (transaction) => {
        const pagamento = await Pagamento.create(
            {
                idStatus: statusPagamentoPendente.id,
                idTipoPagamento: tipoPagamento.id,
            },
            { transaction },
        );

        const pedido = await Pedido.create(
            {
                observacao,
                idPagamento: pagamento.id,
                idCupom,
                idEndereco: enderecoPedido?.id ?? null,
                idPessoa: usuarioId,
                idStatusPedido: statusPedidoRecebido.id,
                idEntregador: null,
                idRestaurante: restauranteId,
            },
            { transaction },
        );

        await Carrinho.update(
            { idPedido: pedido.id },
            {
                where: {
                    idUsuario: usuarioId,
                    idRestaurante: restauranteId,
                    idPedido: { [Op.is]: null },
                },
                transaction,
            },
        );

        return pedido;
    });

    const pedidoCompleto = await carregarPedidoCompleto(resultado.id);

    return res.status(201).json({
        message: 'Pedido criado com sucesso.',
        pedido: pedidoCompleto,
    });
}

export async function historicoPedidos(req, res) {
    const usuarioId = toInteger(req.params.usuarioId);

    if (!usuarioId) {
        return res.status(400).json({ message: 'Informe um usuarioId válido.' });
    }

    const pedidos = await Pedido.findAll({
        where: { idPessoa: usuarioId },
        include: [
            { model: Restaurante, as: 'restaurantes' },
            { model: StatusPedido, as: 'status_pedido' },
            { model: Pagamento, as: 'pagamentos' },
            { model: Cupom, as: 'cupons' },
            { model: Endereco, as: 'enderecos' },
            { model: Carrinho, as: 'carrinhos', include: [{ model: Produto, as: 'produto', include: [{ model: Menu, as: 'menu' }] }] },
            { model: Avaliacao, as: 'avaliacoes' },
        ],
        order: [['created_at', 'DESC']],
    });

    return res.json({
        pedidos: pedidos.map((pedido) => ({
            ...pedido.toJSON(),
            podeAvaliar: pedido.status_pedido?.situacao === 'Entregue' && !(pedido.avaliacoes?.length > 0),
        })),
    });
}

export async function statusDoPedido(req, res) {
    const pedidoId = toInteger(req.params.pedidoId);

    if (!pedidoId) {
        return res.status(400).json({ message: 'Informe um pedidoId válido.' });
    }

    const pedido = await Pedido.findByPk(pedidoId, {
        include: [
            { model: StatusPedido, as: 'status_pedido' },
            { model: Restaurante, as: 'restaurantes' },
        ],
    });

    if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    return res.json({ pedido });
}

export async function criarAvaliacao(req, res) {
    const pedidoId = toInteger(req.params.pedidoId);
    const usuarioId = toInteger(req.body.usuarioId);
    const nota = toInteger(req.body.nota);
    const comentario = String(req.body.comentario ?? '').trim() || null;

    if (!pedidoId || !usuarioId || !nota || nota < 1 || nota > 5) {
        return res.status(400).json({ message: 'Informe pedidoId, usuarioId e nota entre 1 e 5.' });
    }

    const pedido = await Pedido.findByPk(pedidoId, {
        include: [
            { model: StatusPedido, as: 'status_pedido' },
            { model: Avaliacao, as: 'avaliacoes' },
        ],
    });

    if (!pedido) {
        return res.status(404).json({ message: 'Pedido não encontrado.' });
    }

    if (pedido.idPessoa !== usuarioId) {
        return res.status(403).json({ message: 'Este pedido não pertence ao usuário informado.' });
    }

    if (pedido.status_pedido?.situacao !== 'Entregue') {
        return res.status(400).json({ message: 'Só é possível avaliar pedidos entregues.' });
    }

    const avaliacaoExistente = await Avaliacao.findOne({ where: { idPedido: pedidoId } });
    if (avaliacaoExistente) {
        return res.status(409).json({ message: 'Esse pedido já foi avaliado.' });
    }

    const avaliacao = await Avaliacao.create({
        idPedido: pedidoId,
        idUsuario: usuarioId,
        nota,
        comentario,
    });

    return res.status(201).json({ message: 'Avaliação criada com sucesso.', avaliacao });
}

export async function avaliacoesDoRestaurante(req, res) {
    const restauranteId = toInteger(req.params.restauranteId);

    if (!restauranteId) {
        return res.status(400).json({ message: 'Informe um restauranteId válido.' });
    }

    const pedidos = await Pedido.findAll({
        where: { idRestaurante: restauranteId },
        include: [
            {
                model: Avaliacao,
                as: 'avaliacoes',
                include: [
                    { model: Usuario, as: 'usuarios', attributes: ['id', 'nome', 'email'] },
                ],
            },
        ],
        order: [['created_at', 'DESC']],
    });

    const avaliacoes = pedidos.flatMap((pedido) =>
        (pedido.avaliacoes ?? []).map((avaliacao) => ({
            ...avaliacao.toJSON(),
            pedido: {
                id: pedido.id,
                idRestaurante: pedido.idRestaurante,
                created_at: pedido.created_at,
                status_pedido: pedido.status_pedido,
            },
        })),
    );

    const media = avaliacoes.length
        ? avaliacoes.reduce((sum, avaliacao) => sum + Number(avaliacao.nota), 0) / avaliacoes.length
        : 0;

    return res.json({
        media,
        total: avaliacoes.length,
        avaliacoes,
    });
}

export async function listarFavoritos(req, res) {
    const usuarioId = toInteger(req.params.usuarioId);

    if (!usuarioId) {
        return res.status(400).json({ message: 'Informe um usuarioId válido.' });
    }

    const favoritos = await Favorito.findAll({
        where: { idUsuario: usuarioId },
        include: [
            {
                model: Restaurante,
                as: 'restaurantes',
                include: [{ model: Categoria, as: 'categorias', through: { attributes: [] } }],
            },
        ],
        order: [['created_at', 'DESC']],
    });

    return res.json({ favoritos });
}

export async function alternarFavorito(req, res) {
    const usuarioId = toInteger(req.params.usuarioId);
    const restauranteId = toInteger(req.body.restauranteId ?? req.params.restauranteId);

    if (!usuarioId || !restauranteId) {
        return res.status(400).json({ message: 'Informe usuarioId e restauranteId válidos.' });
    }

    const favoritoExistente = await Favorito.findOne({
        where: { idUsuario: usuarioId, idRestaurante: restauranteId },
    });

    if (favoritoExistente) {
        await favoritoExistente.destroy();
        return res.status(200).json({ message: 'Restaurante removido dos favoritos.', favorito: null });
    }

    const favorito = await Favorito.create({ idUsuario: usuarioId, idRestaurante: restauranteId });

    return res.status(201).json({ message: 'Restaurante adicionado aos favoritos.', favorito });
}