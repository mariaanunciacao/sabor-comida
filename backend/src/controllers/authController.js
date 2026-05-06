import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { Restaurante, Usuario, sequelize } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
function normalizeEmail(email) {
    return String(email ?? '').trim().toLowerCase();
}

function hashPassword(password) {
    return bcrypt.hashSync(String(password), 10);
}

function normalizeTipoUsuario(tipo) {
    const allowedTypes = ['admin', 'cliente', 'restaurante', 'restaurante_pendente'];

    return allowedTypes.includes(tipo) ? tipo : 'cliente';
}

export async function login(req, res) {
    const identifier = normalizeEmail(req.body?.identifier ?? req.body?.email ?? req.body?.usuario);
    const senha = String(req.body?.senha ?? '').trim();

    if (!identifier || !senha) {
        return res.status(400).json({ message: 'Informe usuário ou e-mail e senha.' });
    }

    const usuario = await Usuario.findOne({
        where: {
            [Op.or]: [
                { email: identifier },
                { nome: identifier },
            ],
        },
        include: [
            {
                model: Restaurante,
                as: 'restaurantes',
                attributes: ['id', 'nome_restaurante', 'descricao', 'logo_path', 'banner_path', 'horario_atendimento', 'tempo_entrega', 'idUsuario', 'status_aprovacao'],
                required: false,
            },
        ],
    });

    if (!usuario) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const senhaConfere = await bcrypt.compare(senha, usuario.passwordHash);

    if (!senhaConfere) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const restaurante = usuario.restaurantes?.[0] ?? null;
    const tipo = normalizeTipoUsuario(usuario.tipo);

    if (tipo === 'restaurante_pendente') {
        return res.status(403).json({
            message: 'Cadastro em análise.',
            tipo,
            perfil: tipo,
            perfis: [tipo],
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
            },
        });
    }

    if (tipo === 'restaurante' && !restaurante) {
        return res.status(409).json({ message: 'Esse usuário está com perfil restaurante, mas não possui restaurante vinculado.' });
    }

    const idRestaurante = tipo === 'restaurante' ? restaurante?.id ?? null : null;
    const token = jwt.sign(
        {
            id_usuario: usuario.id,
            tipo,
            perfil: tipo,
            perfis: [tipo],
            id_restaurante: idRestaurante,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );

    return res.json({
        token,
        tipo,
        perfil: tipo,
        perfis: [tipo],
        id_restaurante: idRestaurante,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo,
        },
        restaurante: restaurante
            ? {
                id: restaurante.id,
                nome_restaurante: restaurante.nome_restaurante,
                descricao: restaurante.descricao,
                logo_path: restaurante.logo_path,
                banner_path: restaurante.banner_path,
                horario_atendimento: restaurante.horario_atendimento,
                tempo_entrega: restaurante.tempo_entrega,
                status_aprovacao: restaurante.status_aprovacao,
            }
            : null,
    });
}

export async function register(req, res) {
    const nome = String(req.body?.nome ?? '').trim();
    const email = normalizeEmail(req.body?.email);
    const senha = String(req.body?.senha ?? '').trim();
    const tipo = normalizeTipoUsuario(String(req.body?.tipo ?? 'cliente').trim());

    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Informe nome, email e senha.' });
    }

    if (senha.length < 6) {
        return res.status(400).json({ message: 'A senha precisa ter pelo menos 6 caracteres.' });
    }

    const existingUser = await Usuario.findOne({ where: { email } });

    if (existingUser) {
        return res.status(409).json({ message: 'Já existe uma conta com este e-mail.' });
    }

    const result = await sequelize.transaction(async (transaction) => {
        const usuario = await Usuario.create(
            {
                nome,
                email,
                passwordHash: hashPassword(senha),
                tipo,
            },
            { transaction },
        );

        const token = jwt.sign(
            {
                id_usuario: usuario.id,
                tipo,
                perfil: tipo,
                perfis: [tipo],
                id_restaurante: null,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN },
        );

        return {
            token,
            usuario,
        };
    });

    return res.status(201).json({
        token: result.token,
        tipo,
        perfil: tipo,
        perfis: [tipo],
        id_restaurante: null,
        usuario: {
            id: result.usuario.id,
            nome: result.usuario.nome,
            email: result.usuario.email,
            tipo,
        },
        restaurante: null,
    });
}

export async function me(req, res) {
    return res.json({ auth: req.auth });
}
