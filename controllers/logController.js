const { Log, Empresa } = require('../models');

const listLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [['createdAt', 'DESC']],
      include: [{ model: Empresa, attributes: ['email'] }]
    });

    const logsWithSummary = logs.map(log => {
      let summary;
      const cambios = log.cambios || {};
      switch (log.accion) {
        case 'create':
          summary = `Se creó ${log.entidad} con ID ${log.entidadId}.`;
          break;
        case 'update':
          const before = cambios.before || {};
          const after  = cambios.after  || {};
          const diffs = Object.keys(after)
            .filter(key => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
            .map(key => `${key}: '${before[key]}' → '${after[key]}'`)
            .join(', ');
          summary = diffs
            ? `Se actualizaron campos en ${log.entidad} ${log.entidadId}: ${diffs}.`
            : `Se ejecutó update en ${log.entidad} ${log.entidadId} sin cambios detectados.`;
          break;
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
      logs:  logsWithSummary,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('pages/logs', {
      title: 'Historial de Cambios',
      logs:  [],
      error: 'Error al obtener logs'
    });
  }
};

module.exports = { listLogs };
