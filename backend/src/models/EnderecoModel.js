import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Usuario from './UsuarioModel.js';

const Endereco = sequelize.define(
    'enderecos',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        logradouro: {
            type: DataTypes.STRING(240),
            allowNull: false
        },
        cep: {
            type: DataTypes.STRING(15),
            allowNull: false
        },
        numero: {
            type: DataTypes.STRING(10),
            allowNull: false
        },
        cidade: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        estado: {
            type: DataTypes.STRING(30),
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

Endereco.belongsTo(Usuario, { 
    as: 'usuarios', 
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idUsuario',   
        field: 'id_usuario',
        allowNull: false
    }
});

export default Endereco;