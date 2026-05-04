import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';

const Usuario = sequelize.define(
    'usuario',
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
        email: {
            type: DataTypes.STRING(200),
            allowNull: false,
            unique: true
        },
        foto_perfil_path: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        passwordHash: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            field: 'password_hash'
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

export default Usuario;