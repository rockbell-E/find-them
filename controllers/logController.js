const { Log, Empresa } = require('../models');
const { Op } = require('sequelize');

const listLogs = async (req, res) => {
  try {
    const { email, action } = req.query;
    const whereLog = {};
    const whereEmpresa = {};

    if (action) {
      whereLog.accion = action;
    }
    if (email) {
      whereEmpresa.email = { [Op.like]: `%${email}%` };
    }

    const logs = await Log.findAll({
      order: [['createdAt', 'DESC']],
      where: whereLog,
      include: [{ model: Empresa, attributes: ['email'], where: whereEmpresa }]
    });

    const logsWithSummary = logs.map(log => {
      let summary;
      const cambios = log.cambios || {};
      switch (log.accion) {
        case 'create':
          summary = `Se creó ${log.entidad} con ID ${log.entidadId}.`;
          break;
        case 'update': {
          const before = cambios.before || {};
          const after = cambios.after || {};
          const diffs = Object.keys(after)
            .filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
            .map(key => `${key}: '${before[key]}' → '${after[key]}'`)
            .join(', ');
          summary = diffs
            ? `Se actualizaron campos en ${log.entidad} ${log.entidadId}: ${diffs}.`
            : `Se ejecutó update en ${log.entidad} ${log.entidadId} sin cambios detectados.`;
          break;
        }
        case 'delete':
          summary = `Se desactivó ${log.entidad} ${log.entidadId}.`;
          break;
        default:
          summary = JSON.stringify(cambios);
      }

      return {
        ...log.get({ plain: true }),
        empresaEmail: log.Empresa.email,
        summary
      };
    });

    res.render('pages/logs', {
      title: 'Historial de Cambios',
      logs: logsWithSummary,
      filters: { email: email || '', action: action || '' },
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('pages/logs', {
      title: 'Historial de Cambios',
      logs: [],
      filters: { email: '', action: '' },
      error: 'Error al obtener logs'
    });
  }
};

module.exports = { listLogs };