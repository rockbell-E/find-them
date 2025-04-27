const { Log } = require('../models');

const listLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({ order: [['createdAt', 'DESC']] });
    res.render('pages/logs', { title: 'Historial de Cambios', logs, error: null });
  } catch (error) {
    console.error(error);
    res.render('pages/logs', { title: 'Historial de Cambios', logs: [], error: 'Error al obtener logs' });
  }
};

module.exports = { listLogs };
