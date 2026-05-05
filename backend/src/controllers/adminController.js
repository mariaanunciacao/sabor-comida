import { Entregador, Perfil, Restaurante, Usuario, UsuarioPerfil, sequelize } from '../models/index.js';

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

export async function criarPerfil(req, res) {
    const nome = String(req.body?.nome ?? '').trim();
    const perfil = String(req.body?.perfil ?? '').trim().toLowerCase();

    if (!nome || !perfil) {
        return res.status(400).json({ message: 'Informe nome e identificador do perfil.' });
    }

    if (perfil === 'admin') {
        return res.status(409).json({ message: 'O perfil admin é padrão do sistema e já vem criado.' });
    }

    const existingPerfil = await Perfil.findOne({ where: { perfil } });

    if (existingPerfil) {
        return res.status(409).json({ message: 'Já existe um perfil com este identificador.' });
    }

    const createdPerfil = await Perfil.create({ nome, perfil });

    return res.status(201).json({
        message: 'Perfil criado com sucesso.',
        perfil: createdPerfil,
    });
}

export async function atualizarPerfil(req, res) {
    const perfilId = Number(req.params.id);
    const nome = String(req.body?.nome ?? '').trim();
    const perfil = String(req.body?.perfil ?? '').trim().toLowerCase();

    if (!Number.isInteger(perfilId) || perfilId <= 0) {
        return res.status(400).json({ message: 'Informe um perfilId válido.' });
    }

    if (!nome || !perfil) {
        return res.status(400).json({ message: 'Informe nome e identificador do perfil.' });
    }

    const currentPerfil = await Perfil.findByPk(perfilId);

    if (!currentPerfil) {
        return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    if (currentPerfil.perfil === 'admin' && perfil !== 'admin') {
        return res.status(409).json({ message: 'O perfil admin não pode ter seu identificador alterado.' });
    }

    if (perfil === 'admin' && currentPerfil.perfil !== 'admin') {
        return res.status(409).json({ message: 'O perfil admin é padrão do sistema e já vem criado.' });
    }

    const existingPerfil = await Perfil.findOne({ where: { perfil } });

    if (existingPerfil && Number(existingPerfil.id) !== perfilId) {
        return res.status(409).json({ message: 'Já existe um perfil com este identificador.' });
    }

    currentPerfil.nome = nome;
    currentPerfil.perfil = perfil;
    await currentPerfil.save();

    return res.json({
        message: 'Perfil atualizado com sucesso.',
        perfil: currentPerfil,
    });
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

    const statusAtual = restaurante.status_aprovacao ?? 'pendente';
    const trocaDiretaEntreRevisados = (
        (statusAtual === 'aprovado' && statusAprovacao === 'rejeitado')
        || (statusAtual === 'rejeitado' && statusAprovacao === 'aprovado')
    );

    if (trocaDiretaEntreRevisados) {
        return res.status(409).json({
            message: 'Para alternar entre aprovado e reprovado, volte o restaurante para pendente primeiro.',
        });
    }

    restaurante.status_aprovacao = statusAprovacao;
    await restaurante.save();

    return res.json({
        message: 'Status do restaurante atualizado com sucesso.',
        restaurante: toPlainRestaurant(restaurante),
    });
}

export async function atualizarPerfisUsuario(req, res) {
    const usuarioId = Number(req.params.id);
    const perfilId = Number(req.body?.idPerfil);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
        return res.status(400).json({ message: 'Informe um usuarioId válido.' });
    }

    if (!Number.isInteger(perfilId) || perfilId <= 0) {
        return res.status(400).json({ message: 'Informe um perfilId válido.' });
    }

    const usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const perfil = await Perfil.findByPk(perfilId);

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil não encontrado.' });
    }

    await sequelize.transaction(async (transaction) => {
        await UsuarioPerfil.destroy({
            where: { idUsuario: usuarioId },
            transaction,
        });

        await UsuarioPerfil.create(
            {
                idUsuario: usuarioId,
                idPerfil: perfilId,
            },
            { transaction },
        );
    });

    const updatedUser = await Usuario.findByPk(usuarioId, {
        include: [
            {
                model: UsuarioPerfil,
                as: 'usuarios_perfis',
                include: [{ model: Perfil, as: 'perfis', attributes: ['id', 'nome', 'perfil'] }],
                attributes: ['id'],
            },
        ],
    });

    const data = updatedUser.toJSON();

    return res.json({
        message: 'Perfil do usuário atualizado com sucesso.',
        usuario: {
            ...data,
            perfis: (data.usuarios_perfis ?? [])
                .map((relacao) => relacao.perfis)
                .filter(Boolean),
        },
    });
}

