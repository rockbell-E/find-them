
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  
  },
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
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: true,      
    defaultValue: null,
  }
}, {
  tableName: 'users',      
  timestamps: true,        
});

module.exports = User;
