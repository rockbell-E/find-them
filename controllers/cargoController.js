const { Cargo } = require('../models');
const { Op } = require('sequelize');

const listCargos = async (req, res) => {
  try {
    const empresaId   = req.session.user.companyId || req.session.user.id;
    const showDeleted = req.query.deleted === '1';

    const where = { empresaId };
    where.active = showDeleted ? false : true;

    const cargos = await Cargo.findAll({ where });

    res.render('pages/cargos', {
      title:     'Lista de Cargos',
      cargos,
      error:     null,
      showDeleted
    });
  } catch (error) {
    console.error(error);
    res.render('pages/cargos', {
      title:       'Lista de Cargos',
      cargos:      [],
      error:       'Error al obtener cargos',
      showDeleted: req.query.deleted === '1'
    });
  }
};

const getNewCargo = (req, res) => {
  res.render('pages/newCargo', { title: 'Nuevo Cargo', error: null });
};

const createCargo = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const { name }  = req.body;
    await Cargo.create({ name, empresaId, active: true });
    res.redirect('/empresa/cargos');
  } catch (error) {
    console.error(error);
    const errorMsg = error.name === 'SequelizeUniqueConstraintError'
      ? 'Ya existe un cargo con ese nombre en tu empresa.'
      : 'Error al crear cargo';
    res.render('pages/newCargo', { title: 'Nuevo Cargo', error: errorMsg });
  }
};

const getEditCargo = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const cargo     = await Cargo.findOne({ where: { id: req.params.id, empresaId } });
    if (!cargo) return res.redirect('/empresa/cargos');
    res.render('pages/editCargo', { title: 'Editar Cargo', cargo, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/cargos');
  }
};

const updateCargo = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const { name }  = req.body;
    await Cargo.update({ name }, { where: { id: req.params.id, empresaId } });
    res.redirect('/empresa/cargos');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/cargos');
  }
};

const deleteCargo = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    await Cargo.update(
      { active: false },
      { where: { id: req.params.id, empresaId } }
    );
    res.redirect('/empresa/cargos');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/cargos');
  }
};

const restoreCargo = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    await Cargo.update(
      { active: true },
      { where: { id: req.params.id, empresaId } }
    );
    res.redirect('/empresa/cargos?deleted=1');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/cargos?deleted=1');
  }
};

module.exports = {
  listCargos,
  getNewCargo,
  createCargo,
  getEditCargo,
  updateCargo,
  deleteCargo,
  restoreCargo
};
