import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Usuario from './UsuarioModel.js';

const RecuperacaoSenha = sequelize.define(
    'recuperacoes_senha',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email_destino: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        codigo_verificacao: {
            type: DataTypes.STRING(12),
            allowNull: false,
        },
        expira_em: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        usado_em: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'enviado',
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

RecuperacaoSenha.belongsTo(Usuario, {
    as: 'usuario',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idUsuario',
        allowNull: true,
        field: 'id_usuario',
    },
});

export default RecuperacaoSenha;