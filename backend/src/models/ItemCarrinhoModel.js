import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';

import Carrinho from './CarrinhoModel.js';
import Produto from './ProdutoModel.js';

const ItemCarrinho = sequelize.define(
  'itens_carrinho',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    valor_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    observacao: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

ItemCarrinho.belongsTo(Carrinho, {
  as: 'carrinho',
  foreignKey: {
    name: 'idCarrinho',
    field: 'id_carrinho',
    allowNull: false,
  },
});

ItemCarrinho.belongsTo(Produto, {
  as: 'produto',
  foreignKey: {
    name: 'idProduto',
    field: 'id_produto',
    allowNull: false,
  },
});

export default ItemCarrinho;