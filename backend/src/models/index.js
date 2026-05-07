import { sequelize } from '../config/index.js';
import bcrypt from 'bcryptjs';
import Pessoa from './UsuarioModel.js';
import Usuario from './UsuarioModel.js';
import Perfil from './PerfilModel.js';
import UsuarioPerfil from './UsuarioPerfilModel.js';
import Cupom from './CupomModel.js';
import Categoria from './CategoriaModel.js';
import Endereco from './EnderecoModel.js';
import Entregador from './EntregadorModel.js';
import Pagamento from './PagamentoModel.js';
import Restaurante from './RestauranteModel.js';
import RestauranteCategoria from './RestauranteCategoriaModel.js';
import StatusPagamento from './StatusPagamentoModel.js';
import StatusPedido from './StatusPedido.js';
import TipoPagamento from './TipoPagamento.js';
import Pedido from './PedidoModel.js';
import RestauranteEndereco from './RestauranteEndereco.js';
import Menu from './MenuModel.js';
import Produto from './ProdutoModel.js';
import Carrinho from './CarrinhoModel.js';
import Favorito from './FavoritoModel.js';  
import Avaliacao from './AvaliacaoModel.js';    
import RecuperacaoSenha from './RecuperacaoSenhaModel.js';
import ItemCarrinho from './ItemCarrinhoModel.js';

function hashPassword(password) {
    return bcrypt.hashSync(String(password), 10);
}

function resolveUsuarioTipo(usuario) {
    if (usuario.tipo) {
        return usuario.tipo;
    }

    const perfis = (usuario.perfis ?? []).map((perfil) => perfil.perfil);

    if (perfis.includes('admin')) {
        return 'admin';
    }

    if (perfis.includes('restaurante')) {
        return 'restaurante';
    }

    if (perfis.includes('restaurante_pendente')) {
        return 'restaurante_pendente';
    }

    if ((usuario.restaurantes ?? []).length > 0) {
        return 'restaurante';
    }

    return 'cliente';
}

async function backfillUsuarioTipos() {
    const usuarios = await Usuario.findAll({
        include: [
            {
                model: Perfil,
                as: 'perfis',
                attributes: ['perfil'],
                through: { attributes: [] },
            },
            {
                model: Restaurante,
                as: 'restaurantes',
                attributes: ['id'],
                required: false,
            },
        ],
    });

    for (const usuario of usuarios) {
        const tipo = resolveUsuarioTipo(usuario);

        if (usuario.tipo !== tipo) {
            await usuario.update({ tipo });
        }
    }
}

Usuario.hasMany(Restaurante, {
    as: 'restaurantes',
    foreignKey: {
        name: 'idUsuario',
        allowNull: true,
        field: 'id_usuario',
    },
});

Usuario.hasOne(Entregador, {
    as: 'entregador',
    foreignKey: {
        name: 'idUsuario',
        allowNull: true,
        field: 'id_usuario',
    },
});

Usuario.belongsToMany(Perfil, {
    through: UsuarioPerfil,
    as: 'perfis',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario',
    },
    otherKey: {
        name: 'idPerfil',
        allowNull: false,
        field: 'id_perfil',
    },
});

Perfil.belongsToMany(Usuario, {
    through: UsuarioPerfil,
    as: 'usuarios',
    foreignKey: {
        name: 'idPerfil',
        allowNull: false,
        field: 'id_perfil',
    },
    otherKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario',
    },
});

Restaurante.hasMany(Menu, {
    as: 'menus',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

Usuario.hasMany(Pedido, {
    as: 'pedidos',
    foreignKey: {
        name: 'idPessoa',
        allowNull: false,
        field: 'id_pessoa'
    }
});

Restaurante.hasMany(Pedido, {
    as: 'pedidos',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

Usuario.hasMany(Avaliacao, {
    as: 'avaliacoes',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});

Restaurante.belongsToMany(Categoria, {
    through: RestauranteCategoria,
    as: 'categorias',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    },
    otherKey: {
        name: 'idCategoria',
        allowNull: false,
        field: 'id_categoria'
    }
});

Categoria.belongsToMany(Restaurante, {
    through: RestauranteCategoria,
    as: 'restaurantes',
    foreignKey: {
        name: 'idCategoria',
        allowNull: false,
        field: 'id_categoria'
    },
    otherKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

Menu.hasMany(Produto, {
    as: 'produtos',
    foreignKey: {
        name: 'idMenu',
        allowNull: false,
        field: 'id_menu'
    }
});

Produto.hasMany(ItemCarrinho, {
    as: 'itens_carrinho',
    foreignKey: {
        name: 'idProduto',
        allowNull: false,
        field: 'id_produto'
    }
});

ItemCarrinho.belongsTo(Produto, {
    as: 'produto_carrinho',
    foreignKey: {
        name: 'idProduto',
        allowNull: false,
        field: 'id_produto'
    }
});

Categoria.hasMany(Produto, {
    as: 'produtos',
    foreignKey: {
        name: 'idCategoria',
        allowNull: false,
        field: 'id_categoria'
    }
});

Usuario.hasMany(Endereco, {
    as: 'enderecos',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});

Restaurante.hasMany(RestauranteEndereco, {
    as: 'enderecos_restaurante',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

Restaurante.hasMany(Favorito, {
    as: 'favoritos',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurantes'
    }
});

Usuario.hasMany(Favorito, {
    as: 'favoritos',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});

Usuario.hasMany(Carrinho, {
    as: 'carrinhos',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});

Usuario.hasMany(RecuperacaoSenha, {
    as: 'recuperacoes_senha',
    foreignKey: {
        name: 'idUsuario',
        allowNull: true,
        field: 'id_usuario',
    },
});

Restaurante.hasMany(Carrinho, {
    as: 'carrinhos',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

Carrinho.hasMany(ItemCarrinho, {
    as: 'itens',
    foreignKey: {
        name: 'idCarrinho',
        allowNull: false,
        field: 'id_carrinho'
    }
});

ItemCarrinho.belongsTo(Carrinho, {
    as: 'carrinho_item',
    foreignKey: {
        name: 'idCarrinho',
        allowNull: false,
        field: 'id_carrinho'
    }
});

Pedido.hasMany(Avaliacao, {
    as: 'avaliacoes',
    foreignKey: {
        name: 'idPedido',
        allowNull: false,
        field: 'id_pedido'
    }
});

export {
    sequelize,
    Pessoa,
    Usuario,
    Perfil,
    Cupom,
    Categoria,
    Endereco,
    Entregador,
    Pagamento,
    Restaurante,
    StatusPagamento,
    StatusPedido,
    TipoPagamento,
    Pedido,
    RestauranteEndereco,
    RestauranteCategoria,
    Menu,
    Produto,
    Carrinho,
    Favorito,
    Avaliacao,
    RecuperacaoSenha,
    UsuarioPerfil,
    ItemCarrinho,
};

export async function initializeModels() {
    await sequelize.sync({ alter: { drop: false } });
    await backfillUsuarioTipos();

    await Perfil.findOrCreate({
        where: { perfil: 'admin' },
        defaults: { nome: 'Administrador', perfil: 'admin' },
    });

    const adminPerfil = await Perfil.findOne({ where: { perfil: 'admin' } });

    if (adminPerfil) {
        const [kingUser, created] = await Usuario.findOrCreate({
            where: { email: 'king@admin.local' },
            defaults: {
                nome: 'king',
                email: 'king@admin.local',
                passwordHash: hashPassword('king'),
                tipo: 'admin',
            },
        });

        if (!created) {
            await kingUser.update({
                nome: 'king',
                passwordHash: hashPassword('king'),
                tipo: 'admin',
            });
        }

        await UsuarioPerfil.findOrCreate({
            where: {
                idUsuario: kingUser.id,
                idPerfil: adminPerfil.id,
            },
            defaults: {
                idUsuario: kingUser.id,
                idPerfil: adminPerfil.id,
            },
        });
    }
}
