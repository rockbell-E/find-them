const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empresa = sequelize.define('Empresa', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  headquarters: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,  
    validate: {
      isEmail: true, 
    }
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,  
  }
}, {
  tableName: 'empresas',
  timestamps: true,
});


module.exports = Empresa;
