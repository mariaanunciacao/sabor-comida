import { Entregador, Usuario } from '../models/index.js';

function normalizeText(value) {
    return String(value ?? '').trim();
}

export async function listarEntregadores(req, res) {
    const entregadores = await Entregador.findAll({
        include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nome', 'email'], required: false }],
        order: [['id', 'ASC']],
    });

    return res.json(entregadores);
}

export async function criarEntregador(req, res) {
    const nome = normalizeText(req.body?.nome);
    const email = normalizeText(req.body?.email).toLowerCase();
    const telefone = normalizeText(req.body?.telefone);
    const veiculo = normalizeText(req.body?.veiculo);
    const regiaoAtuacao = normalizeText(req.body?.regiao_atuacao);

    if (!nome || !email || !telefone || !veiculo || !regiaoAtuacao) {
        return res.status(400).json({ message: 'Informe nome, email, telefone, veículo e região de atuação.' });
    }

    const existingEntregador = await Entregador.findOne({ where: { email } });

    if (existingEntregador) {
        return res.status(409).json({ message: 'Já existe um entregador com este e-mail.' });
    }

    const entregador = await Entregador.create({
        nome,
        email,
        telefone,
        veiculo,
        regiao_atuacao: regiaoAtuacao,
        idUsuario: null,
    });

    return res.status(201).json({
        message: 'Entregador criado com sucesso.',
        entregador,
    });
}

export async function atualizarEntregador(req, res) {
    const entregadorId = Number(req.params.id);
    const nome = normalizeText(req.body?.nome);
    const email = normalizeText(req.body?.email).toLowerCase();
    const telefone = normalizeText(req.body?.telefone);
    const veiculo = normalizeText(req.body?.veiculo);
    const regiaoAtuacao = normalizeText(req.body?.regiao_atuacao);

    if (!Number.isInteger(entregadorId) || entregadorId <= 0) {
        return res.status(400).json({ message: 'Informe um entregadorId válido.' });
    }

    if (!nome || !email || !telefone || !veiculo || !regiaoAtuacao) {
        return res.status(400).json({ message: 'Informe nome, email, telefone, veículo e região de atuação.' });
    }

    const entregador = await Entregador.findByPk(entregadorId);

    if (!entregador) {
        return res.status(404).json({ message: 'Entregador não encontrado.' });
    }

    const existingEntregador = await Entregador.findOne({ where: { email } });

    if (existingEntregador && Number(existingEntregador.id) !== entregadorId) {
        return res.status(409).json({ message: 'Já existe um entregador com este e-mail.' });
    }

    entregador.nome = nome;
    entregador.email = email;
    entregador.telefone = telefone;
    entregador.veiculo = veiculo;
    entregador.regiao_atuacao = regiaoAtuacao;

    await entregador.save();

    return res.json({
        message: 'Entregador atualizado com sucesso.',
        entregador,
    });
}

export async function excluirEntregador(req, res) {
    const entregadorId = Number(req.params.id);

    if (!Number.isInteger(entregadorId) || entregadorId <= 0) {
        return res.status(400).json({ message: 'Informe um entregadorId válido.' });
    }

    const entregador = await Entregador.findByPk(entregadorId);

    if (!entregador) {
        return res.status(404).json({ message: 'Entregador não encontrado.' });
    }

    await entregador.destroy();

    return res.json({ message: 'Entregador excluído com sucesso.' });
}