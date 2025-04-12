
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cargo = sequelize.define('Cargo', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  }
}, {
  tableName: 'cargos',
  timestamps: true,
});

module.exports = Cargo;
