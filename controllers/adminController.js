
const { Company, Worker } = require('../models'); 

const dashboard = (req, res) => {
  res.render('pages/adminDashboard', { title: 'Admin Dashboard', user: req.session.user });
};

const listCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ where: { active: true } });
    res.render('pages/companies', { title: 'Lista de Empresas', companies });
  } catch (error) {
    console.error(error);
    res.render('pages/companies', { title: 'Lista de Empresas', error: 'Error al obtener empresas' });
  }
};

const getNewCompany = (req, res) => {
  res.render('pages/newCompany', { title: 'Nueva Empresa' });
};

const createCompany = async (req, res) => {
  try {
    const { name, headquarters, email, contact } = req.body;
    await Company.create({ name, headquarters, email, contact, active: true });
    res.redirect('/admin/companies');
  } catch (error) {
    console.error(error);
    res.render('pages/newCompany', { title: 'Nueva Empresa', error: 'Error al crear empresa' });
  }
};

const getEditCompany = async (req, res) => {
  try {
    const company = await Company.findByPk(req.params.id);
    res.render('pages/editCompany', { title: 'Editar Empresa', company });
  } catch (error) {
    console.error(error);
    res.redirect('/admin/companies');
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, headquarters, email, contact } = req.body;
    await Company.update({ name, headquarters, email, contact }, { where: { id: req.params.id } });
    res.redirect('/admin/companies');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/companies');
  }
};

const deleteCompany = async (req, res) => {
  try {
    await Company.update({ active: false }, { where: { id: req.params.id } });
    res.redirect('/admin/companies');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/companies');
  }
};

const listWorkers = async (req, res) => {
  try {
    const companyId = req.params.id;
    const workers = await Worker.findAll({ where: { companyId, active: true } });
    res.render('pages/workers', { title: 'Lista de Trabajadores', workers, companyId });
  } catch (error) {
    console.error(error);
    res.render('pages/workers', { title: 'Lista de Trabajadores', error: 'Error al obtener trabajadores' });
  }
};

const getNewWorker = (req, res) => {
  const companyId = req.params.id;
  res.render('pages/newWorker', { title: 'Nuevo Trabajador', companyId });
};

const createWorker = async (req, res) => {
  try {
    const companyId = req.params.id;
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
    res.redirect(`/admin/companies/${companyId}/workers`);
  } catch (error) {
    console.error(error);
    res.redirect(`/admin/companies/${req.params.id}/workers`);
  }
};

const getEditWorker = async (req, res) => {
  try {
    const companyId = req.params.id;
    const worker = await Worker.findByPk(req.params.workerId);
    res.render('pages/editWorker', { title: 'Editar Trabajador', worker, companyId });
  } catch (error) {
    console.error(error);
    res.redirect(`/admin/companies/${req.params.id}/workers`);
  }
};

const updateWorker = async (req, res) => {
  try {
    const companyId = req.params.id;
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;
    await Worker.update(
      { firstName, secondName, lastName, motherLastName, position, location },
      { where: { id: req.params.workerId } }
    );
    res.redirect(`/admin/companies/${companyId}/workers`);
  } catch (error) {
    console.error(error);
    res.redirect(`/admin/companies/${req.params.id}/workers`);
  }
};

const deleteWorker = async (req, res) => {
  try {
    const companyId = req.params.id;
    await Worker.update({ active: false }, { where: { id: req.params.workerId } });
    res.redirect(`/admin/companies/${companyId}/workers`);
  } catch (error) {
    console.error(error);
    res.redirect(`/admin/companies/${companyId}/workers`);
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
