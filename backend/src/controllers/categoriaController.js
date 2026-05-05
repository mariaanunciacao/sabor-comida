import { Categoria, Produto, RestauranteCategoria, sequelize } from '../models/index.js';

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

    const produtosVinculados = await Produto.count({ where: { idCategoria: categoriaId } });

    if (produtosVinculados > 0) {
        return res.status(409).json({ message: 'Não é possível excluir uma categoria que já está vinculada a produtos.' });
    }

    await sequelize.transaction(async (transaction) => {
        await RestauranteCategoria.destroy({
            where: { idCategoria: categoriaId },
            transaction,
        });

        await categoria.destroy({ transaction });
    });

    return res.json({ message: 'Categoria excluída com sucesso.' });
}