import { sequelize } from '../config/index.js';
import { DataTypes } from 'sequelize';
import Usuario from './UsuarioModel.js';
import Restaurante from './RestauranteModel.js';

const Carrinho = sequelize.define(
  'carrinhos',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
      idProduto: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'id_produto',
      },

      quantidade: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      valor_individual: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      idPedido: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'id_pedido',
      },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

Carrinho.belongsTo(Usuario, {
  as: 'usuario',
  foreignKey: {
    name: 'idUsuario',
    field: 'id_usuario',
    allowNull: false,
  },
});

Carrinho.belongsTo(Restaurante, {
  as: 'restaurante',
  foreignKey: {
    name: 'idRestaurante',
    field: 'id_restaurante',
    allowNull: false,
  },
});

export default Carrinho;