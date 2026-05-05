import { Categoria, Entregador, Perfil, Produto, Restaurante, RestauranteCategoria, Usuario, UsuarioPerfil, sequelize } from '../models/index.js';

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

export async function listarCategorias(req, res) {
    const categorias = await Categoria.findAll({ order: [['id', 'ASC']] });
    return res.json(categorias);
}

export async function criarCategoria(req, res) {
    const nomeCategoria = String(req.body?.nome_categoria ?? '').trim();
    const imagemPath = String(req.body?.imagem_path ?? '').trim();

    if (!nomeCategoria) {
        return res.status(400).json({ message: 'Informe o nome da categoria.' });
    }

    const existingCategory = await Categoria.findOne({ where: { nome_categoria: nomeCategoria } });

    if (existingCategory) {
        return res.status(409).json({ message: 'Já existe uma categoria com este nome.' });
    }

    const categoria = await Categoria.create({
        nome_categoria: nomeCategoria,
        imagem_path: imagemPath || null,
    });

    return res.status(201).json({
        message: 'Categoria criada com sucesso.',
        categoria,
    });
}

export async function atualizarCategoria(req, res) {
    const categoriaId = Number(req.params.id);
    const nomeCategoria = String(req.body?.nome_categoria ?? '').trim();
    const imagemPath = String(req.body?.imagem_path ?? '').trim();

    if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
        return res.status(400).json({ message: 'Informe uma categoriaId válida.' });
    }

    if (!nomeCategoria) {
        return res.status(400).json({ message: 'Informe o nome da categoria.' });
    }

    const categoria = await Categoria.findByPk(categoriaId);

    if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    const existingCategory = await Categoria.findOne({ where: { nome_categoria: nomeCategoria } });

    if (existingCategory && Number(existingCategory.id) !== categoriaId) {
        return res.status(409).json({ message: 'Já existe uma categoria com este nome.' });
    }

    categoria.nome_categoria = nomeCategoria;
    categoria.imagem_path = imagemPath || null;

    await categoria.save();

    return res.json({
        message: 'Categoria atualizada com sucesso.',
        categoria,
    });
}

export async function excluirCategoria(req, res) {
    const categoriaId = Number(req.params.id);

    if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
        return res.status(400).json({ message: 'Informe uma categoriaId válida.' });
    }

    const categoria = await Categoria.findByPk(categoriaId);

    if (!categoria) {
        return res.status(404).json({ message: 'Categoria não encontrada.' });
    }

    const [restaurantesVinculados, produtosVinculados] = await Promise.all([
        RestauranteCategoria.count({ where: { idCategoria: categoriaId } }),
        Produto.count({ where: { idCategoria: categoriaId } }),
    ]);

    if (restaurantesVinculados > 0 || produtosVinculados > 0) {
        return res.status(409).json({ message: 'Não é possível excluir uma categoria que já está vinculada a restaurantes ou produtos.' });
    }

    await categoria.destroy();

    return res.json({ message: 'Categoria excluída com sucesso.' });
}
