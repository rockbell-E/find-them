const bcrypt = require('bcrypt');
const { Trabajador, Branch, Empresa } = require('../models');

const dashboard = (req, res) => {
  if (req.session.user && req.session.user.firstLogin) {
    return res.redirect('/empresa/changePassword');
  }
  res.render('pages/empresaDashboard', { title: 'Empresa Dashboard', user: req.session.user });
};

const listWorkers = async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const workers = await Trabajador.findAll({ where: { companyId, active: true } });
    res.render('pages/empresaWorkers', { title: 'Lista de Trabajadores', workers, error: null });
  } catch (error) {
    console.error(error);
    res.render('pages/empresaWorkers', { title: 'Lista de Trabajadores', workers: [], error: 'Error al obtener trabajadores' });
  }
};

const getNewWorker = (req, res) => {
  res.render('pages/empresaNewWorker', { title: 'Nuevo Trabajador', error: null });
};

const createWorker = async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;
    await Trabajador.create({ firstName, secondName, lastName, motherLastName, position, location, companyId, active: true });
    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const getEditWorker = async (req, res) => {
  try {
    const worker = await Trabajador.findByPk(req.params.workerId);
    if (!worker) return res.redirect('/empresa/workers');
    res.render('pages/empresaEditWorker', { title: 'Editar Trabajador', worker, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const updateWorker = async (req, res) => {
  try {
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;
    await Trabajador.update({ firstName, secondName, lastName, motherLastName, position, location }, { where: { id: req.params.workerId } });
    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const deleteWorker = async (req, res) => {
  try {
    await Trabajador.update({ active: false }, { where: { id: req.params.workerId } });
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
    res.render('pages/branches', { title: 'Lista de Sucursales', branches, error: null });
  } catch (error) {
    console.error(error);
    res.render('pages/branches', { title: 'Lista de Sucursales', branches: [], error: 'Error al obtener sucursales' });
  }
};

const getNewBranch = (req, res) => {
  res.render('pages/newBranch', { title: 'Nueva Sucursal', error: null });
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
    if (!branch) return res.redirect('/empresa/branches');
    res.render('pages/editBranch', { title: 'Editar Sucursal', branch, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const updateBranch = async (req, res) => {
  try {
    const { name, location } = req.body;
    await Branch.update({ name, location }, { where: { id: req.params.branchId } });
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

const getChangePassword = (req, res) => {
  res.render('pages/changePassword', { title: 'Cambiar Contraseña', error: null });
};

const postChangePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const empresaId = req.session.user.id;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await Empresa.update({ password: hashedPassword, firstLogin: false }, { where: { id: empresaId } });
    req.session.user.firstLogin = false;
    res.redirect('/empresa/dashboard');
  } catch (error) {
    console.error(error);
    res.render('pages/changePassword', { title: 'Cambiar Contraseña', error: 'Error al actualizar la contraseña' });
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
  deleteBranch,
  getChangePassword,
  postChangePassword
};
