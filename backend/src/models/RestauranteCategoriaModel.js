import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Restaurante from './RestauranteModel.js';
import Categoria from './CategoriaModel.js';

const RestauranteCategoria = sequelize.define(
    'restaurantes_categorias',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    },
    {
        freezeTableName: true,
        timestamps: false
    }
);

RestauranteCategoria.belongsTo(Restaurante, {
    as: 'restaurante',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurante'
    }
});

RestauranteCategoria.belongsTo(Categoria, {
    as: 'categoria',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: 'idCategoria',
        allowNull: false,
        field: 'id_categoria'
    }
});

export default RestauranteCategoria;