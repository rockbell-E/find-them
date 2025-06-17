const express = require('express');
const router = express.Router();
const { getLogin, postLogin, logout } = require('../controllers/unifiedAuthController');

router.get('/login', getLogin);
router.post('/login', postLogin);
router.get('/logout', logout);

router.get('/forgot-password', getForgotPassword);
router.post('/forgot-password', postForgotPassword);

module.exports = router;
