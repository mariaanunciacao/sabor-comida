import { Pedido, StatusPedido, Entregador, sequelize } from '../models/index.js';

export const listarPedidosRestaurante = async (req, res) => {
  const restauranteId = req.restaurante.id;

  const pedidos = await Pedido.findAll({
    where: { idRestaurante: restauranteId },
    include: ['status_pedido', 'pessoas', 'entregadores', 'pagamentos', 'carrinhos'],
    order: [['created_at', 'DESC']],
  });

  res.json(pedidos);
};

export const alterarStatusPedido = async (req, res) => {
  const pedidoId = Number(req.params.id);
  const novoStatusId = Number(req.body.idStatus);

  if (!Number.isInteger(pedidoId) || !Number.isInteger(novoStatusId)) {
    return res.status(400).json({ message: 'Pedido ou status inválido.' });
  }

  const pedido = await Pedido.findByPk(pedidoId, { include: ['restaurantes'] });
  if (!pedido || pedido.idRestaurante !== req.restaurante.id) {
    return res.status(404).json({ message: 'Pedido não encontrado para este restaurante.' });
  }

  pedido.idStatusPedido = novoStatusId;
  await pedido.save();

  res.json({ message: 'Status do pedido atualizado.', pedido });
};

export const atribuirEntregador = async (req, res) => {
  const pedidoId = Number(req.params.id);

  if (!Number.isInteger(pedidoId)) {
    return res.status(400).json({ message: 'Pedido inválido.' });
  }

  const pedido = await Pedido.findByPk(pedidoId, { include: ['status_pedido'] });
  if (!pedido || pedido.idRestaurante !== req.restaurante.id) {
    return res.status(404).json({ message: 'Pedido não encontrado para este restaurante.' });
  }

  const status = String(pedido.status_pedido?.situacao ?? pedido.status_pedido?.nome ?? '').toLowerCase();
  if (status !== 'pronto') {
    return res.status(400).json({ message: 'Entregador só pode ser atribuído quando pedido estiver pronto.' });
  }

  const entregador = await Entregador.findOne({ order: sequelize.random() });
  if (!entregador) {
    return res.status(404).json({ message: 'Nenhum entregador disponível.' });
  }

  pedido.idEntregador = entregador.id;
  await pedido.save();

  res.json({ message: 'Entregador atribuído com sucesso.', pedido, entregador });
};
