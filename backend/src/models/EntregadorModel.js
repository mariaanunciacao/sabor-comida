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
        nome: {
            type: DataTypes.STRING(90),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(200),
            allowNull: true,
            unique: true,
        },
        telefone: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        veiculo: {
            type: DataTypes.STRING(90),
            allowNull: true,
        },
        regiao_atuacao: {
            type: DataTypes.STRING(120),
            allowNull: true,
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

