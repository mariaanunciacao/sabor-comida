import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Restaurante from './RestauranteModel.js';

const RestauranteEndereco = sequelize.define(
    'restaurantes_enderecos',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        logradouro: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        cep: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        numero: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        cidade: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING(200),
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

RestauranteEndereco.belongsTo(Restaurante, {
    as: 'restaurantes',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idRestaurante', 
        allowNull: false,
        field: 'id_restaurante'
    }
});

export default RestauranteEndereco; 
