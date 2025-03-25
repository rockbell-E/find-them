const express = require('express');
const router = express.Router();
const empresaController = require('../controllers/empresaController');

router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'empresa') {
    return next();
  }
  res.redirect('/login');
});

router.get('/dashboard', empresaController.dashboard);

router.get('/workers', empresaController.listWorkers);
router.get('/workers/new', empresaController.getNewWorker);
router.post('/workers', empresaController.createWorker);
router.get('/workers/:workerId/edit', empresaController.getEditWorker);
router.post('/workers/:workerId', empresaController.updateWorker);
router.post('/workers/:workerId/delete', empresaController.deleteWorker);

router.get('/branches', empresaController.listBranches);
router.get('/branches/new', empresaController.getNewBranch);
router.post('/branches', empresaController.createBranch);
router.get('/branches/:branchId/edit', empresaController.getEditBranch);
router.post('/branches/:branchId', empresaController.updateBranch);
router.post('/branches/:branchId/delete', empresaController.deleteBranch);


router.get('/changePassword', empresaController.getChangePassword);
router.post('/changePassword', empresaController.postChangePassword);

module.exports = router;