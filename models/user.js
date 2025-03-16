// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'empresa'),
    allowNull: false,
  },
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
  }
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
