// models/user.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,   
    validate: {
      isEmail: true,   
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'empresa'),
    allowNull: false, 
  }
}, {
  tableName: 'users',
  timestamps: true, 
});

module.exports = User;
