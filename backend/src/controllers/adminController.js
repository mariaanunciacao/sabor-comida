import { Entregador, Perfil, Restaurante, Usuario, UsuarioPerfil } from '../models/index.js';

function toPlainRestaurant(restaurante) {
    const data = restaurante.toJSON();

    return {
        ...data,
        status_aprovacao: data.status_aprovacao ?? 'pendente',
    };
}

export async function listarUsuarios(req, res) {
    const usuarios = await Usuario.findAll({
        include: [
            {
                model: UsuarioPerfil,
                as: 'usuarios_perfis',
                include: [{ model: Perfil, as: 'perfis', attributes: ['id', 'nome', 'perfil'] }],
                attributes: ['id'],
            },
            {
                model: Restaurante,
                as: 'restaurantes',
                attributes: ['id', 'nome_restaurante', 'cnpj'],
                required: false,
            },
        ],
        order: [['id', 'ASC']],
    });

    return res.json(usuarios.map((usuario) => {
        const data = usuario.toJSON();

        return {
            ...data,
            perfis: (data.usuarios_perfis ?? [])
                .map((relacao) => relacao.perfis)
                .filter(Boolean),
        };
    }));
}

export async function listarPerfis(req, res) {
    const perfis = await Perfil.findAll({ order: [['id', 'ASC']] });
    return res.json(perfis);
}

export async function listarEntregadores(req, res) {
    const entregadores = await Entregador.findAll({
        include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] }],
        order: [['id', 'ASC']],
    });

    return res.json(entregadores);
}

export async function listarRestaurantes(req, res) {
    const restaurantes = await Restaurante.findAll({
        include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'] }],
        order: [['id', 'ASC']],
    });

    return res.json(restaurantes.map(toPlainRestaurant));
}

export async function atualizarStatusRestaurante(req, res) {
    const restauranteId = Number(req.params.id);
    const statusAprovacao = String(req.body?.status_aprovacao ?? '').trim();
    const statusPermitidos = ['pendente', 'aprovado', 'rejeitado'];

    if (!Number.isInteger(restauranteId) || restauranteId <= 0) {
        return res.status(400).json({ message: 'Informe um restauranteId válido.' });
    }

    if (!statusPermitidos.includes(statusAprovacao)) {
        return res.status(400).json({ message: 'Status de aprovação inválido.' });
    }

    const restaurante = await Restaurante.findByPk(restauranteId);

    if (!restaurante) {
        return res.status(404).json({ message: 'Restaurante não encontrado.' });
    }

    restaurante.status_aprovacao = statusAprovacao;
    await restaurante.save();

    return res.json({
        message: 'Status do restaurante atualizado com sucesso.',
        restaurante: toPlainRestaurant(restaurante),
    });
}
