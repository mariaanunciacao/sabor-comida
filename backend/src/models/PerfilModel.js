import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';

const Perfil = sequelize.define(
    'perfis',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome: {
            type: DataTypes.STRING(90),
            allowNull: false
        },
        perfil: {
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

export default Perfil;

