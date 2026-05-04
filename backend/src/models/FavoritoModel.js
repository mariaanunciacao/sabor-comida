import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Restaurante from './RestauranteModel.js';
import Usuario from './UsuarioModel.js';

const Favorito = sequelize.define(
    'favoritos',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Favorito.belongsTo(Restaurante, {
    as: 'restaurantes',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idRestaurante',
        allowNull: false,
        field: 'id_restaurantes'
    }
});

Favorito.belongsTo(Usuario, {
    as: 'usuarios',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idUsuario',
        allowNull: false,
        field: 'id_usuario'
    }
});

export default Favorito;