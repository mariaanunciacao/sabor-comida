import Restaurante from '../models/RestauranteModel.js';

export default async function (req, res, next) {
  const auth = req.auth;

  if (!auth || (auth.tipo !== 'restaurante' && auth.perfil !== 'restaurante')) {
    return res.status(403).json({ message: 'Acesso negado' });
  }

  const usuarioId = auth.id_usuario ?? auth.idUsuario ?? auth.id;
  const restaurante = await Restaurante.findOne({ where: { idUsuario: usuarioId } });

  if (!restaurante || restaurante.status_aprovacao !== 'aprovado') {
    return res.status(403).json({ message: 'Restaurante ainda não aprovado' });
  }

  req.restaurante = restaurante;
  next();
}
