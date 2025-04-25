const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cargo = sequelize.define('Cargo', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
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
  indexes: [
    {
      unique: true,
      fields: ['empresaId', 'name']
    }
  ]
});

module.exports = Cargo;
