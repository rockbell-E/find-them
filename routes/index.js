
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index', { title: 'Inicio', user: req.session.user || null });
});

module.exports = router;
