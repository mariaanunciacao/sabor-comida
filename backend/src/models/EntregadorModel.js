import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Usuario from './UsuarioModel.js';

const Entregador = sequelize.define(
    'entregadores',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'id_usuario',
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

Entregador.belongsTo(Usuario, {
    as: 'usuario',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: 'idUsuario',
        allowNull: true,
        field: 'id_usuario',
    },
});



export default Entregador;

