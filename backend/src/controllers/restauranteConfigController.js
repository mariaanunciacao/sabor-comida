export const atualizarRestaurante = async (req, res) => {
  const restaurante = req.restaurante;

  if (!restaurante) {
    return res.status(404).json({ message: 'Restaurante não encontrado.' });
  }

  // Do not allow changing CNPJ
  const payload = { ...req.body };
  if (payload.cnpj) {
    delete payload.cnpj;
  }

  await restaurante.update(payload);

  res.json({ message: 'Atualizado com sucesso' });
};
