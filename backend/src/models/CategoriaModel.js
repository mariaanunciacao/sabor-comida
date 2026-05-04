import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';

const Categoria = sequelize.define (
    'categorias',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome_categoria: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        imagem_path: {
            type: DataTypes.STRING(500),
            allowNull: true,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
);

export default Categoria;