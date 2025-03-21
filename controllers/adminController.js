const { Empresa, Trabajador } = require('../models');
const { Op } = require('sequelize');

const dashboard = (req, res) => {
  console.log('Accediendo al dashboard del admin');
  res.render('pages/adminDashboard', { title: 'Admin Dashboard', user: req.session.user, error: null });
};

const listCompanies = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    let empresas;

    if (searchQuery) {
      empresas = await Empresa.findAll({
        where: {
          active: true,
          name: { [Op.like]: `%${searchQuery}%` }
        }
      });
    } else {
      empresas = await Empresa.findAll({ where: { active: true } });
    }
    
    res.render('pages/companies', { title: 'Lista de Empresas', empresas, searchQuery, error: null });
  } catch (error) {
    console.error(error);
    res.render('pages/companies', { title: 'Lista de Empresas', empresas: [], searchQuery: '', error: 'Error al obtener empresas' });
  }
};

const getNewCompany = (req, res) => {
  res.render('pages/newCompany', { title: 'Nueva Empresa', error: null });
};

const createCompany = async (req, res) => {
  try {
    const { name, headquarters, email, contact } = req.body;
    await Empresa.create({ name, headquarters, email, contact, active: true });
    res.redirect('/admin/companies');
  } catch (error) {
    console.error(error);
    res.render('pages/newCompany', { title: 'Nueva Empresa', error: 'Error al crear la empresa' });
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
  deleteWorker
};
