const bcrypt = require('bcrypt');
const { Trabajador, Sucursal, Empresa, Cargo, Log } = require('../models');

const dashboard = (req, res) => {
  if (req.session.user && req.session.user.firstLogin) {
    return res.redirect('/empresa/changePassword');
  }
  res.render('pages/empresaDashboard', { title: 'Empresa Dashboard', user: req.session.user });
};

const listWorkers = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;

    const workers = await Trabajador.findAll({
      where: { empresaId, active: true }
    });

    const cargos = await Cargo.findAll({ where: { empresaId, active: true } });
    const sucursales = await Sucursal.findAll({ where: { empresaId, active: true } });

    res.render('pages/empresaWorkers', {
      title: 'Lista de Trabajadores',
      workers,
      cargos,
      sucursales,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('pages/empresaWorkers', {
      title: 'Lista de Trabajadores',
      workers: [],
      cargos: [],
      sucursales: [],
      error: 'Error al obtener trabajadores'
    });
  }
};

const getNewWorker = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const cargos = await Cargo.findAll({ where: { empresaId, active: true } });
    const sucursales = await Sucursal.findAll({ where: { empresaId, active: true } });

    res.render('pages/empresaNewWorker', {
      title: 'Nuevo Trabajador',
      cargos,
      sucursales,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.render('pages/empresaNewWorker', {
      title: 'Nuevo Trabajador',
      cargos: [],
      sucursales: [],
      error: 'Error al obtener datos'
    });
  }
};

const createWorker = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const usuarioId = req.session.user.id;
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;

    const worker = await Trabajador.create({
      firstName,
      secondName,
      lastName,
      motherLastName,
      position,
      location,
      empresaId,
      active: true
    });

    await Log.create({
      empresaId,
      usuarioId,
      entidad: 'Trabajador',
      entidadId: worker.id,
      accion: 'create',
      cambios: worker.toJSON()
    });

    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const getEditWorker = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const worker = await Trabajador.findByPk(req.params.workerId);
    if (!worker) return res.redirect('/empresa/workers');

    const cargos = await Cargo.findAll({ where: { empresaId, active: true } });
    const sucursales = await Sucursal.findAll({ where: { empresaId, active: true } });

    res.render('pages/empresaEditWorker', {
      title: 'Editar Trabajador',
      worker,
      cargos,
      sucursales,
      error: null
    });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const updateWorker = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const usuarioId = req.session.user.id;
    const workerId = req.params.workerId;
    const before = await Trabajador.findByPk(workerId);
    const { firstName, secondName, lastName, motherLastName, position, location } = req.body;

    await Trabajador.update(
      { firstName, secondName, lastName, motherLastName, position, location },
      { where: { id: workerId } }
    );

    const after = await Trabajador.findByPk(workerId);
    await Log.create({
      empresaId,
      usuarioId,
      entidad: 'Trabajador',
      entidadId: workerId,
      accion: 'update',
      cambios: { before: before.toJSON(), after: after.toJSON() }
    });

    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const deleteWorker = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId || req.session.user.id;
    const usuarioId = req.session.user.id;
    const workerId = req.params.workerId;

    await Trabajador.update({ active: false }, { where: { id: workerId } });
    await Log.create({
      empresaId,
      usuarioId,
      entidad: 'Trabajador',
      entidadId: workerId,
      accion: 'delete',
      cambios: { active: false }
    });

    res.redirect('/empresa/workers');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/workers');
  }
};

const listBranches = async (req, res) => {
  try {
    const companyId = req.session.user.companyId;
    const branches = await Sucursal.findAll({ where: { empresaId: companyId, active: true } });
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
    const empresaId = req.session.user.companyId;
    const usuarioId = req.session.user.id;
    const { name, location } = req.body;

    const branch = await Sucursal.create({ name, location, empresaId, active: true });
    await Log.create({ empresaId, usuarioId, entidad: 'Sucursal', entidadId: branch.id, accion: 'create', cambios: branch.toJSON() });
    res.redirect('/empresa/branches');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const getEditBranch = async (req, res) => {
  try {
    const branch = await Sucursal.findByPk(req.params.branchId);
    if (!branch) return res.redirect('/empresa/branches');
    res.render('pages/editBranch', { title: 'Editar Sucursal', branch, error: null });
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const updateBranch = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId;
    const usuarioId = req.session.user.id;
    const branchId = req.params.branchId;
    const before = await Sucursal.findByPk(branchId);
    const { name, location } = req.body;

    await Sucursal.update({ name, location }, { where: { id: branchId } });
    const after = await Sucursal.findByPk(branchId);
    await Log.create({ empresaId, usuarioId, entidad: 'Sucursal', entidadId: branchId, accion: 'update', cambios: { before: before.toJSON(), after: after.toJSON() } });

    res.redirect('/empresa/branches');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const deleteBranch = async (req, res) => {
  try {
    const empresaId = req.session.user.companyId;
    const usuarioId = req.session.user.id;
    const branchId = req.params.branchId;

    await Sucursal.update({ active: false }, { where: { id: branchId } });
    await Log.create({ empresaId, usuarioId, entidad: 'Sucursal', entidadId: branchId, accion: 'delete', cambios: { active: false } });

    res.redirect('/empresa/branches');
  } catch (error) {
    console.error(error);
    res.redirect('/empresa/branches');
  }
};

const getChangePassword = (req, res) => {
  console.log('Accediendo al cambio de pass de la empresa');
  res.render('pages/changePassword', { title: 'Cambiar Contraseña', error: null });
};

const postChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const empresaId = req.session.user.id;
    
    const empresa = await Empresa.findByPk(empresaId);
    if (!empresa) {
      throw new Error('Empresa no encontrada');
    }

    const match = await bcrypt.compare(currentPassword, empresa.password);
    if (!match) {
      return res.render('pages/changePassword', {
        title: 'Cambiar Contraseña',
        error: 'La contraseña actual no coincide'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.render('pages/changePassword', {
        title: 'Cambiar Contraseña',
        error: 'La nueva contraseña y su confirmación no coinciden'
      });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await Empresa.update(
      { password: hashed, firstLogin: false },
      { where: { id: empresaId } }
    );
    await Log.create({
      empresaId,
      usuarioId: empresaId,
      entidad: 'Empresa',
      entidadId: empresaId,
      accion: 'update',
      cambios: { before: { firstLogin: empresa.firstLogin }, after: { firstLogin: false } }
    });

    req.session.user.firstLogin = false;
    res.redirect('/empresa/dashboard');
    
  } catch (error) {
    console.error(error);
    res.render('pages/changePassword', {
      title: 'Cambiar Contraseña',
      error: 'Error al actualizar la contraseña'
    });
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
