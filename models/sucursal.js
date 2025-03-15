
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sucursal = sequelize.define('Sucursal', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'sucursales',
  timestamps: true,
});

module.exports = Sucursal;
