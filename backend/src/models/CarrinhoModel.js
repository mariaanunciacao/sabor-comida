import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Pedido from './PedidoModel.js';
import Usuario from './UsuarioModel.js';
import Restaurante from './RestauranteModel.js';
import Produto from './ProdutoModel.js';

const Carrinho = sequelize.define(
    'carrinhos',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        quantidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        valor_individual: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Carrinho.belongsTo(Usuario, {
    as: 'usuario',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});

Carrinho.belongsTo(Restaurante, {
    as: 'restaurante',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

Carrinho.belongsTo(Produto, {
    as: 'produto',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idProduto',
        allowNull: false,
        field: 'id_produto'
    }
});

Carrinho.belongsTo(Pedido, {
    as: 'pedido',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idPedido',
        allowNull: true,
        field: 'id_pedido'
    }
});

export default Carrinho;