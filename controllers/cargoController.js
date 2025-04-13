
const { Cargo } = require('../models');

const listCargos = async (req, res) => {
  try {
    const cargos = await Cargo.findAll();
    res.render('pages/cargos', { title: 'Lista de Cargos', cargos, error: null });
  } catch (error) {
    console.error(error);
    res.render('pages/cargos', { title: 'Lista de Cargos', cargos: [], error: 'Error al obtener cargos' });
  }
};

const getNewCargo = (req, res) => {
  res.render('pages/newCargo', { title: 'Nuevo Cargo', error: null });
};

const createCargo = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const { name } = req.body;
    
    await Cargo.create({ name, empresaId, active: true });
    
    res.redirect('/empresa/cargos');
  } catch (error) {
    console.error(error);
    res.render('pages/newCargo', { title: 'Nuevo Cargo', error: 'Error al crear cargo' });
  }
};

const getEditCargo = async (req, res) => {
  try {
    const cargo = await Cargo.findByPk(req.params.id);
    if (!cargo) return res.redirect('/empresa/cargos');
    res.render('pages/editCargo', { title: 'Editar Cargo', cargo, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/cargos');
  }
};

const updateCargo = async (req, res) => {
  try {
    const { name } = req.body;
    await Cargo.update({ name }, { where: { id: req.params.id } });
    res.redirect('/empresa/cargos');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/cargos');
  }
};

const deleteCargo = async (req, res) => {
  try {
    await Cargo.destroy({ where: { id: req.params.id } });
    res.redirect('/empresa/cargos');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/cargos');
  }
};

module.exports = {
  listCargos,
  getNewCargo,
  createCargo,
  getEditCargo,
  updateCargo,
  deleteCargo
};
