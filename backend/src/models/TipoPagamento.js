import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';

const TipoPagamento = sequelize.define(
    'tipos_pagamento',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        tipo: {
            type: DataTypes.STRING(100),
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

export default TipoPagamento;