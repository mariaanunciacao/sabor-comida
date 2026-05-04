import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Pedido from './PedidoModel.js';
import Usuario from './UsuarioModel.js';

const Avaliacao = sequelize.define(
    'avaliacoes',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nota: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        comentario: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_usuario'
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Avaliacao.belongsTo(Pedido, {
    as: 'avaliacoes',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idPedido',
        allowNull: false,
        unique: true,
        field: 'id_pedido'
    }
});

Avaliacao.belongsTo(Usuario, {
    as: 'usuarios',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});

export default Avaliacao;