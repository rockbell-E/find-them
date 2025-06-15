const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { listLogs } = require('../controllers/logController');

router.use((req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/login');
});

router.get('/dashboard', adminController.dashboard);

router.get('/companies', adminController.listCompanies);
router.get('/companies/new', adminController.getNewCompany);
router.post('/companies', adminController.createCompany);
router.get('/companies/:id/edit', adminController.getEditCompany);
router.post('/companies/:id', adminController.updateCompany);
router.post('/companies/:id/delete', adminController.deleteCompany);
router.post('/companies/:id/restore', adminController.restoreCompany);

router.get('/companies/:id/workers', adminController.listWorkers);
router.get('/companies/:id/workers/new', adminController.getNewWorker);
router.post('/companies/:id/workers', adminController.createWorker);
router.get('/companies/:id/workers/:workerId/edit', adminController.getEditWorker);
router.post('/companies/:id/workers/:workerId', adminController.updateWorker);
router.post('/companies/:id/workers/:workerId/delete', adminController.deleteWorker);

router.post('/force-password-reset', adminController.forcePasswordReset);

router.get('/change-password', adminController.getChangePassword);
router.post('/change-password', adminController.postChangePassword);


router.get('/logs', listLogs);

module.exports = router;
