import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Cupom from './CupomModel.js';
import Usuario from './UsuarioModel.js';

const Restaurante = sequelize.define(
    'restaurantes',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        cnpj: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        nome_restaurante: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING(300),
            allowNull: true,
        },
        logo_path: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        banner_path: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        status_aprovacao: {
            type: DataTypes.STRING(30),
            allowNull: false,
            defaultValue: 'pendente',
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'id_usuario',
        },
        horario_atendimento: {
            type: DataTypes.STRING(240),
            allowNull: false
        },
        tempo_entrega: {
            type: DataTypes.TIME,
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

Restaurante.belongsTo(Cupom, {
    as: 'cupons', 
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idCupom', 
        allowNull: true,
        field: 'id_cupom'        
    }
});

Restaurante.belongsTo(Usuario, {
    as: 'usuario',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    foreignKey: {
        name: 'idUsuario',
        allowNull: true,
        field: 'id_usuario',
    },
});

export default Restaurante;