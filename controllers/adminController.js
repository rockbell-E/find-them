const { Empresa, Trabajador } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}


const dashboard = (req, res) => {
  console.log('Accediendo al dashboard del admin');
  res.render('pages/adminDashboard', { title: 'Admin Dashboard', user: req.session.user, error: null });
};

const listCompanies = async (req, res) => {
  try {
    const showDeleted = req.query.deleted === '1';
    const searchQuery = req.query.search || '';
    let empresas;

    const whereClause = {
      active: showDeleted ? false : true,
    };

    if (searchQuery) {
      whereClause.name = { [Op.like]: `%${searchQuery}%` };
    }

    empresas = await Empresa.findAll({ where: whereClause });

    res.render('pages/companies', {
      title: showDeleted ? 'Empresas Eliminadas' : 'Lista de Empresas',
      empresas,
      searchQuery,
      error: null,
      showDeleted
    });
  } catch (error) {
    console.error(error);
    res.render('pages/companies', {
      title: 'Lista de Empresas',
      empresas: [],
      searchQuery: '',
      error: 'Error al obtener empresas',
      showDeleted: req.query.deleted === '1'
    });
  }
};

const restoreCompany = async (req, res) => {
  try {
    await Empresa.update({ active: true }, { where: { id: req.params.id } });
    res.redirect('/admin/companies?deleted=1');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/companies?deleted=1');
  }
};


const getNewCompany = (req, res) => {
  res.render('pages/newCompany', { title: 'Nueva Empresa', error: null });
};

const createCompany = async (req, res) => {
  try {
    const { name, headquarters, email, contact } = req.body;

    const tempPassword   = generatePassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const empresa = await Empresa.create({
      name,
      headquarters,
      email,
      contact,
      password:    hashedPassword,
      active:      true,
      firstLogin:  true
    });

    console.log(`🔐 Contraseña temporal para ${empresa.email}: ${tempPassword}`);

    res.redirect('/admin/companies');
  } catch (error) {
    console.error(error);
    res.render('pages/newCompany', {
      title: 'Nueva Empresa',
      error: 'Error al crear la empresa'
    });
  }
};

const getEditCompany = async (req, res) => {
  try {
    const empresa = await Empresa.findByPk(req.params.id);
    if (!empresa) return res.redirect('/admin/companies');
    res.render('pages/editCompany', { title: 'Editar Empresa', empresa, error: null });
  } catch (error) {
    console.error(error);
    res.render('pages/editCompany', { title: 'Editar Empresa', empresa });

  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, headquarters, email, contact } = req.body;
    await Empresa.update({ name, headquarters, email, contact }, { where: { id: req.params.id } });
    res.redirect('/admin/companies');
  } catch (error) {
    console.error(error);
    const empresa = await Empresa.findByPk(req.params.id);
    res.render('pages/editCompany', { title: 'Editar Empresa', empresa, error: 'Error al actualizar la empresa' });
  }
};

const deleteCompany = async (req, res) => {
  try {
    await Empresa.update({ active: false }, { where: { id: req.params.id } });
    res.redirect('/admin/companies');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/companies');
  }
};

const listWorkers = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const workers = await Trabajador.findAll({ where: { empresaId, active: true } });
    res.render('pages/workers', { title: 'Lista de Trabajadores', workers, empresaId, error: null });
  } catch (error) {
    console.error(error);
    res.render('pages/workers', { title: 'Lista de Trabajadores', workers: [], empresaId: req.params.id, error: 'Error al obtener trabajadores' });
  }
};

const getNewWorker = (req, res) => {
  const empresaId = req.params.id;
  res.render('pages/newWorker', { title: 'Nuevo Trabajador', empresaId, error: null });
};

const createWorker = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;
    await Trabajador.create({
      firstName,
      secondName,
      lastName,
      motherLastName,
      position,
      location,
      empresaId,
      active: true
    });
    res.redirect(`/admin/companies/${empresaId}/workers`);
  } catch (error) {
    console.error(error);
    res.render('pages/newWorker', { title: 'Nuevo Trabajador', empresaId: req.params.id, error: 'Error al crear el trabajador' });
  }
};

const getEditWorker = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const worker = await Trabajador.findByPk(req.params.workerId);
    if (!worker) return res.redirect(`/admin/companies/${empresaId}/workers`);
    res.render('pages/editWorker', { title: 'Editar Trabajador', worker, empresaId, error: null });
  } catch (error) {
    console.error(error);
    res.redirect(`/admin/companies/${req.params.id}/workers`);
  }
};

const updateWorker = async (req, res) => {
  try {
    const empresaId = req.params.id;
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;
    await Trabajador.update(
      { firstName, secondName, lastName, motherLastName, position, location },
      { where: { id: req.params.workerId } }
    );
    res.redirect(`/admin/companies/${empresaId}/workers`);
  } catch (error) {
    console.error(error);
    const worker = await Trabajador.findByPk(req.params.workerId);
    res.render('pages/editWorker', { title: 'Editar Trabajador', worker, empresaId: req.params.id, error: 'Error al actualizar el trabajador' });
  }
};

const deleteWorker = async (req, res) => {
  try {
    const empresaId = req.params.id;
    await Trabajador.update({ active: false }, { where: { id: req.params.workerId } });
    res.redirect(`/admin/companies/${empresaId}/workers`);
  } catch (error) {
    console.error(error);
    res.redirect(`/admin/companies/${empresaId}/workers`);
  }
};

module.exports = {
  dashboard,
  listCompanies,
  getNewCompany,
  createCompany,
  getEditCompany,
  updateCompany,
  deleteCompany,
  listWorkers,
  getNewWorker,
  createWorker,
  getEditWorker,
  updateWorker,
  deleteWorker,
  restoreCompany
};
