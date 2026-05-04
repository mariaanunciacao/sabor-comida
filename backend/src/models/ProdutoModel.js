import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Categoria from './CategoriaModel.js';
import Menu from './MenuModel.js';

const Produto = sequelize.define(
    'produtos',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        nome_produto: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        descricao: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        preco: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        ingredientes: {
            type: DataTypes.STRING(200),
            allowNull: false
        },
        imagem_path: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);

Produto.belongsTo(Categoria, {
    as: 'categoria',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idCategoria',
        allowNull: false,
        field: 'id_categoria'
    }
});

Produto.belongsTo(Menu, {
    as: 'menu',
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
    foreignKey: {
        name: 'idMenu',
        allowNull: false,
        field: 'id_menu'
    }
});

export default Produto;