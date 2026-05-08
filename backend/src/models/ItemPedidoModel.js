import { sequelize } from "../config/index.js";
import { DataTypes } from "sequelize";

import Pedido from "./PedidoModel.js";
import Produto from "./ProdutoModel.js";

const ItemPedido = sequelize.define(
  "itens_pedido",
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
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

ItemPedido.belongsTo(Pedido, {
  as: "pedido",
  foreignKey: {
    name: "idPedido",
    field: "id_pedido",
    allowNull: false,
  },
});

ItemPedido.belongsTo(Produto, {
  as: "produto",
  foreignKey: {
    name: "idProduto",
    field: "id_produto",
    allowNull: false,
  },
});

export default ItemPedido;