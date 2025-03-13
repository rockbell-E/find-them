
const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('pages/login', { title: 'Iniciar Sesión' });
});

router.post('/login', (req, res) => {
  res.redirect('/dashboard');
});

module.exports = router;
