import { Categoria, Menu, Produto, Restaurante, RestauranteEndereco } from '../models/index.js';

function toPlainRestaurant(restaurante) {
    const data = restaurante.toJSON();
    const enderecos = data.enderecos_restaurante ?? [];
    const categorias = data.categorias ?? [];
    const menus = (data.menus ?? []).map((menu) => ({
        ...menu,
        produtos: menu.produtos ?? [],
    }));

    const produtos = menus
        .flatMap((menu) => (menu.produtos ?? []).map((produto) => ({
            ...produto,
            menuId: menu.id,
            menuNome: menu.nome_menu,
        })))
        .sort((produtoA, produtoB) => Number(produtoA.id) - Number(produtoB.id));

    return {
        ...data,
        logoUrl: data.logo_path ?? null,
        bannerUrl: data.banner_path ?? null,
        statusAprovacao: data.status_aprovacao ?? 'pendente',
        enderecoPrincipal: enderecos[0] ?? null,
        enderecos,
        categorias,
        menus,
        produtos,
    };
}

const restaurantInclude = [
    {
        model: Categoria,
        as: 'categorias',
        attributes: ['id', 'nome_categoria'],
        through: { attributes: [] },
    },
    {
        model: RestauranteEndereco,
        as: 'enderecos_restaurante',
        attributes: ['id', 'logradouro', 'cep', 'numero', 'cidade', 'estado'],
    },
    {
        model: Menu,
        as: 'menus',
        attributes: ['id', 'nome_menu', 'descricao'],
        include: [
            {
                model: Produto,
                as: 'produtos',
                attributes: ['id', 'nome_produto', 'descricao', 'preco', 'ingredientes', 'ativo', 'idCategoria'],
            },
        ],
    },
];

export async function listarRestaurantes(req, res) {
    const restaurantes = await Restaurante.findAll({
        include: restaurantInclude,
        order: [['id', 'ASC']],
    });

    return res.json(restaurantes.map(toPlainRestaurant));
}

export async function listarRestaurantePorId(req, res) {
    const restauranteId = Number(req.params.id);

    if (!Number.isInteger(restauranteId) || restauranteId <= 0) {
        return res.status(400).json({ message: 'Informe um restauranteId válido.' });
    }

    const restaurante = await Restaurante.findByPk(restauranteId, {
        include: restaurantInclude,
    });

    if (!restaurante) {
        return res.status(404).json({ message: 'Restaurante não encontrado.' });
    }

    return res.json(toPlainRestaurant(restaurante));
}

export async function meuRestaurante(req, res) {
    const restauranteId = Number(req.auth?.id_restaurante);

    if (!Number.isInteger(restauranteId) || restauranteId <= 0) {
        return res.status(403).json({ message: 'O usuário autenticado não possui restaurante vinculado.' });
    }

    const restaurante = await Restaurante.findOne({
        where: {
            id: restauranteId,
            idUsuario: req.auth.id_usuario,
        },
        include: restaurantInclude,
    });

    if (!restaurante) {
        return res.status(404).json({ message: 'Restaurante vinculado não encontrado.' });
    }

    return res.json(toPlainRestaurant(restaurante));
}

export async function atualizarMeuRestaurante(req, res) {
    const restauranteId = Number(req.auth?.id_restaurante);

    if (!Number.isInteger(restauranteId) || restauranteId <= 0) {
        return res.status(403).json({ message: 'O usuário autenticado não possui restaurante vinculado.' });
    }

    const restaurante = await Restaurante.findOne({
        where: {
            id: restauranteId,
            idUsuario: req.auth.id_usuario,
        },
    });

    if (!restaurante) {
        return res.status(404).json({ message: 'Restaurante vinculado não encontrado.' });
    }

    const camposAtualizaveis = ['cnpj', 'nome_restaurante', 'descricao', 'logo_path', 'banner_path', 'horario_atendimento', 'tempo_entrega'];

    for (const campo of camposAtualizaveis) {
        if (Object.prototype.hasOwnProperty.call(req.body ?? {}, campo)) {
            const valorAtualizado = req.body[campo];
            restaurante[campo] = typeof valorAtualizado === 'string' ? valorAtualizado.trim() : valorAtualizado;
        }
    }

    if (restaurante.status_aprovacao !== 'aprovado') {
        restaurante.status_aprovacao = 'pendente';
    }

    await restaurante.save();

    return res.json({ message: 'Restaurante atualizado com sucesso.', restaurante: toPlainRestaurant(restaurante) });
}