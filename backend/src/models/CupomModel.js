import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';

const Cupom = sequelize.define(
    'cupons',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        condicao: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        valor: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        porcentagem: {
            type: DataTypes.NUMERIC,
            allowNull: true
        },
        ativo: {
            type: DataTypes.BOOLEAN,
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

export default Cupom;