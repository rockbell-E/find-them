
const sequelize = require('../config/database');

const User = require('./user');
const Empresa = require('./empresa');
const Trabajador = require('./trabajador');
const Sucursal = require('./sucursal');
const Cargo = require('./cargo');
const Log = require('./log');

Empresa.hasMany(Trabajador, { foreignKey: 'empresaId', as: 'trabajadores' });
Trabajador.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

Empresa.hasMany(Sucursal, { foreignKey: 'empresaId', as: 'sucursales' });
Sucursal.belongsTo(Empresa, { foreignKey: 'empresaId', as: 'empresa' });

module.exports = {
  sequelize,
  User,
  Empresa,
  Trabajador,
  Sucursal,
  Cargo,
  Log
};
