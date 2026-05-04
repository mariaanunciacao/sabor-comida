import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Restaurante from './RestauranteModel.js';

const Menu = sequelize.define(
    'menus',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome_menu: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING(250),
            allowNull: true
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Menu.belongsTo(Restaurante, {
    as: 'restaurante',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

export default Menu;