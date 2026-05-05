import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { Perfil, Restaurante, Usuario, UsuarioPerfil, sequelize } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-jwt-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';
const ROLE_PRIORITY = ['admin', 'restaurante', 'cliente'];

function normalizeEmail(email) {
    return String(email ?? '').trim().toLowerCase();
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(String(password)).digest('hex');
}

function mapUserProfiles(usuario) {
    const profiles = (usuario.usuarios_perfis ?? [])
        .map((relacao) => relacao.perfis)
        .filter(Boolean)
        .map((perfil) => ({
            id: perfil.id,
            nome: perfil.nome,
            perfil: perfil.perfil,
        }));

    return profiles.filter((perfil, index, array) => array.findIndex((item) => item.perfil === perfil.perfil) === index);
}

function choosePrimaryProfile(perfis) {
    for (const perfil of ROLE_PRIORITY) {
        if (perfis.some((item) => item.perfil === perfil)) {
            return perfil;
        }
    }

    return perfis[0]?.perfil ?? null;
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
                model: UsuarioPerfil,
                as: 'usuarios_perfis',
                include: [{ model: Perfil, as: 'perfis', attributes: ['id', 'nome', 'perfil'] }],
            },
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

    if (usuario.passwordHash !== hashPassword(senha)) {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const perfis = mapUserProfiles(usuario);

    if (perfis.length === 0) {
        return res.status(403).json({ message: 'Usuário sem perfil vinculado.' });
    }

    const perfil = choosePrimaryProfile(perfis);
    const restaurante = usuario.restaurantes?.[0] ?? null;

    if (perfil === 'restaurante' && !restaurante) {
        return res.status(409).json({ message: 'Esse usuário está com perfil restaurante, mas não possui restaurante vinculado.' });
    }

    const idRestaurante = perfil === 'restaurante' ? restaurante?.id ?? null : null;
    const token = jwt.sign(
        {
            id_usuario: usuario.id,
            perfil,
            perfis: perfis.map((item) => item.perfil),
            id_restaurante: idRestaurante,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
    );

    return res.json({
        token,
        perfil,
        perfis,
        id_restaurante: idRestaurante,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
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

    const clientePerfil = await Perfil.findOne({ where: { perfil: 'cliente' } });

    if (!clientePerfil) {
        return res.status(500).json({ message: 'Perfil cliente não configurado no banco.' });
    }

    const result = await sequelize.transaction(async (transaction) => {
        const usuario = await Usuario.create(
            {
                nome,
                email,
                passwordHash: hashPassword(senha),
            },
            { transaction },
        );

        await UsuarioPerfil.create(
            {
                idUsuario: usuario.id,
                idPerfil: clientePerfil.id,
            },
            { transaction },
        );

        const token = jwt.sign(
            {
                id_usuario: usuario.id,
                perfil: 'cliente',
                perfis: ['cliente'],
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
        perfil: 'cliente',
        perfis: ['cliente'],
        id_restaurante: null,
        usuario: {
            id: result.usuario.id,
            nome: result.usuario.nome,
            email: result.usuario.email,
        },
        restaurante: null,
    });
}

export async function me(req, res) {
    return res.json({ auth: req.auth });
}
