
const express = require('express');
const router = express.Router();
const cargoController = require('../controllers/cargoController');

router.get('/cargos', cargoController.listCargos);

router.get('/cargos/new', cargoController.getNewCargo);
router.post('/cargos', cargoController.createCargo);

router.get('/cargos/:id/edit', cargoController.getEditCargo);
router.post('/cargos/:id', cargoController.updateCargo);

router.post('/cargos/:id/delete', cargoController.deleteCargo);

router.post('cargos/:id/restore', cargoController.restoreCargo);

module.exports = router;
