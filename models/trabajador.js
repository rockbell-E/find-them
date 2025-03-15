
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trabajador = sequelize.define('Trabajador', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  secondName: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  motherLastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
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
  tableName: 'trabajadores', 
  timestamps: true, 
});

module.exports = Trabajador;
