import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Perfil from './PerfilModel.js';
import Usuario from './UsuarioModel.js';

const UsuarioPerfil = sequelize.define(
    'usuarios_perfis',
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

UsuarioPerfil.belongsTo(Usuario, {
    as: 'usuarios', 
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idUsuario', 
        allowNull: false,
        field: 'id_usuario'        
    }
});

UsuarioPerfil.belongsTo(Perfil, {
    as: 'perfis', 
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idPerfil', 
        allowNull: false,
        field: 'id_perfil'        
    }
});

export default UsuarioPerfil;