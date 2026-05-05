import { Op } from 'sequelize';
import { Categoria, Menu, Produto, Restaurante } from '../models/index.js';

function buildLike(query) {
    return `%${query}%`;
}

export async function search(req, res) {
    const rawQuery = String(req.query.q ?? req.query.query ?? '').trim();

    if (!rawQuery) {
        return res.status(200).json({
            query: '',
            restaurantes: [],
            menus: [],
            categorias: [],
            produtos: [],
        });
    }

    const like = buildLike(rawQuery);

    const [restaurantesPorNome, restaurantesPorCategoria, menus, categorias, produtos] = await Promise.all([
        Restaurante.findAll({
            where: {
                [Op.or]: [
                    { nome_restaurante: { [Op.like]: like } },
                    { cnpj: { [Op.like]: like } },
                ],
            },
            include: [
                { model: Categoria, as: 'categorias', attributes: ['id', 'nome_categoria'], through: { attributes: [] } },
            ],
            limit: 10,
        }),
        Restaurante.findAll({
            include: [
                {
                    model: Categoria,
                    as: 'categorias',
                    where: {
                        nome_categoria: { [Op.like]: like },
                    },
                    attributes: ['id', 'nome_categoria'],
                    through: { attributes: [] },
                    required: true,
                },
            ],
            limit: 10,
        }),
        Menu.findAll({
            where: {
                [Op.or]: [
                    { nome_menu: { [Op.like]: like } },
                    { descricao: { [Op.like]: like } },
                ],
            },
            include: [
                { model: Restaurante, as: 'restaurante', attributes: ['id', 'nome_restaurante'] },
            ],
            limit: 10,
        }),
        Categoria.findAll({
            where: {
                nome_categoria: { [Op.like]: like },
            },
            limit: 10,
        }),
        Produto.findAll({
            where: {
                [Op.or]: [
                    { nome_produto: { [Op.like]: like } },
                    { descricao: { [Op.like]: like } },
                    { ingredientes: { [Op.like]: like } },
                ],
            },
            include: [
                { model: Categoria, as: 'categoria', attributes: ['id', 'nome_categoria'] },
                {
                    model: Menu,
                    as: 'menu',
                    attributes: ['id', 'nome_menu'],
                    include: [{ model: Restaurante, as: 'restaurante', attributes: ['id', 'nome_restaurante'] }],
                },
            ],
            limit: 15,
        }),
    ]);

    const restaurantes = [...restaurantesPorNome, ...restaurantesPorCategoria].reduce((accumulator, restaurante) => {
        if (!accumulator.some((item) => item.id === restaurante.id)) {
            accumulator.push(restaurante);
        }

        return accumulator;
    }, []);

    return res.json({
        query: rawQuery,
        restaurantes,
        menus,
        categorias,
        produtos,
    });
}

export async function listarCategorias(req, res) {
    const categorias = await Categoria.findAll({
        order: [['id', 'ASC']],
    });

    return res.json(categorias);
}