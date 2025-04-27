const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Log = sequelize.define('Log', {
  empresaId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  entidad: {
    type: DataTypes.STRING,
    allowNull: false
  },
  entidadId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cambios: {
    type: DataTypes.JSON,
    allowNull: true
  }
}, {
  tableName: 'logs',
  timestamps: true
});

module.exports = Log;
