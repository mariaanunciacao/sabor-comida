import { Pagamento, Pedido, TipoPagamento, StatusPagamento, Usuario } from '../models/index.js';

export const listarPagamentos = async (req, res) => {
  const restauranteId = req.restaurante.id;

  const pedidos = await Pedido.findAll({
    where: { idRestaurante: restauranteId },
    include: [
      { model: Pagamento, as: 'pagamentos', include: [TipoPagamento, StatusPagamento] },
      { model: Usuario, as: 'pessoas' },
    ],
    order: [['created_at', 'DESC']],
  });

  const pagamentos = pedidos.flatMap((pedido) => {
    const pagamento = pedido.pagamentos ? [pedido.pagamentos] : [];
    return pagamento.map((p) => ({ ...p.toJSON(), pedido: { id: pedido.id, pessoa: pedido.pessoas } }));
  });

  res.json(pagamentos);
};

export const marcarComoPago = async (req, res) => {
  const { id } = req.params;

  const pagamento = await Pagamento.findByPk(id);

  if (!pagamento) {
    return res.status(404).json({ message: 'Pagamento não encontrado' });
  }

  const pedido = await Pedido.findOne({ where: { idPagamento: pagamento.id }, include: ['status_pedido'] });

  if (!pedido) {
    return res.status(404).json({ message: 'Pedido relacionado ao pagamento não encontrado' });
  }

  const statusPedido = String(pedido.status_pedido?.situacao ?? pedido.status_pedido?.nome ?? '').toLowerCase();

  if (!['pronto', 'saiu_entrega', 'entregue'].includes(statusPedido)) {
    return res.status(400).json({ message: 'Não é possível marcar como pago neste status' });
  }

  pagamento.idStatus = 2; // pago
  await pagamento.save();

  return res.json({ message: 'Pagamento atualizado com sucesso' });
};
