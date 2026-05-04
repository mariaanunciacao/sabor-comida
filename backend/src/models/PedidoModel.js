import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Pagamento from './PagamentoModel.js';
import Cupom from './CupomModel.js';
import Endereco from './EnderecoModel.js';
import Usuario from './UsuarioModel.js';
import StatusPedido from './StatusPedido.js';
import Entregador from './EntregadorModel.js';
import Restaurante from './RestauranteModel.js';

const Pedido = sequelize.define(
    'pedidos',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        observacao: {
            type: DataTypes.STRING(200),
            allowNull: true
        },
        idRestaurante: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'id_restaurante'
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Pedido.belongsTo(Pagamento, {
    as: 'pagamentos',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idPagamento',
        allowNull: false,
        field: 'id_pagamento'
    }
});

Pedido.belongsTo(Cupom, {
    as: 'cupons',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idCupom',
        allowNull: true,
        field: 'id_cupom'
    }
});

Pedido.belongsTo(Endereco, {
    as: 'enderecos',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idEndereco',
        allowNull: true,
        field: 'id_endereco'
    }
});

Pedido.belongsTo(Usuario, {
    as: 'pessoas',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idPessoa',
        allowNull: false,
        field: 'id_pessoa'
    }
});

Pedido.belongsTo(StatusPedido, {
    as: 'status_pedido',
    onDelete: 'NO ACTION', 
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idStatusPedido',
        allowNull: false,
        field: 'id_status_pedido'
    }
});

Pedido.belongsTo(Entregador, {
    as: 'entregadores',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idEntregador',
        allowNull: true,
        field: 'id_entregador'
    }
});

Pedido.belongsTo(Restaurante, {
    as: 'restaurantes',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

export default Pedido;