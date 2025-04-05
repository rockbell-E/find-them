
const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');

// Ruta para listar cargos
router.get('/cargos', cargoController.listCargos);

// Rutas para crear un nuevo cargo
router.get('/cargos/new', cargoController.getNewCargo);
router.post('/cargos', cargoController.createCargo);

// Rutas para editar un cargo
router.get('/cargos/:id/edit', cargoController.getEditCargo);
router.post('/cargos/:id', cargoController.updateCargo);

// Ruta para eliminar un cargo
router.post('/cargos/:id/delete', cargoController.deleteCargo);

module.exports = router;
