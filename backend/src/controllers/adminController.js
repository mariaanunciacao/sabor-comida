import { Entregador, Perfil, Restaurante, Usuario, UsuarioPerfil } from '../models/index.js';

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
