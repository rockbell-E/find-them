const { Worker, Branch } = require('../models'); 

const dashboard = (req, res) => {
  res.render('pages/empresaDashboard', { title: 'Empresa Dashboard', user: req.session.user });
};

const listWorkers = async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const workers = await Worker.findAll({ where: { companyId, active: true } });
    res.render('pages/empresaWorkers', { title: 'Lista de Trabajadores', workers });
  } catch (error) {
    console.error(error);
    res.render('pages/empresaWorkers', { title: 'Lista de Trabajadores', error: 'Error al obtener trabajadores' });
  }
};

const getNewWorker = (req, res) => {
  res.render('pages/empresaNewWorker', { title: 'Nuevo Trabajador' });
};

const createWorker = async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;
    await Worker.create({
      firstName,
      secondName,
      lastName,
      motherLastName,
      position,
      location,
      companyId,
      active: true
    });
    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const getEditWorker = async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.workerId);
    res.render('pages/empresaEditWorker', { title: 'Editar Trabajador', worker });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const updateWorker = async (req, res) => {
  try {
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;
    await Worker.update(
      { firstName, secondName, lastName, motherLastName, position, location },
      { where: { id: req.params.workerId } }
    );
    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const deleteWorker = async (req, res) => {
  try {
    await Worker.update({ active: false }, { where: { id: req.params.workerId } });
    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const listBranches = async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const branches = await Branch.findAll({ where: { companyId, active: true } });
    res.render('pages/branches', { title: 'Lista de Sucursales', branches });
  } catch (error) {
    console.error(error);
    res.render('pages/branches', { title: 'Lista de Sucursales', error: 'Error al obtener sucursales' });
  }
};

const getNewBranch = (req, res) => {
  res.render('pages/newBranch', { title: 'Nueva Sucursal' });
};

const createBranch = async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const { name, location } = req.body;
    await Branch.create({ name, location, companyId, active: true });
    res.redirect('/empresa/branches');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const getEditBranch = async (req, res) => {
  try {
    const branch = await Branch.findByPk(req.params.branchId);
    res.render('pages/editBranch', { title: 'Editar Sucursal', branch });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const updateBranch = async (req, res) => {
  try {
    const { name, location } = req.body;
    await Branch.update(
      { name, location },
      { where: { id: req.params.branchId } }
    );
    res.redirect('/empresa/branches');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const deleteBranch = async (req, res) => {
  try {
    await Branch.update({ active: false }, { where: { id: req.params.branchId } });
    res.redirect('/empresa/branches');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

module.exports = {
  dashboard,
  listWorkers,
  getNewWorker,
  createWorker,
  getEditWorker,
  updateWorker,
  deleteWorker,
  listBranches,
  getNewBranch,
  createBranch,
  getEditBranch,
  updateBranch,
  deleteBranch
};
