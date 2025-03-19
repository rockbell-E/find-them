const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Empresa } = require('../models');

function generatePassword() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

router.get('/register', (req, res) => {
  res.render('pages/registerEmpresa', { title: 'Registrar Empresa', error: null });
});

router.post('/register', async (req, res) => {
  const { name, headquarters, email, contact } = req.body;
  try {
    const tempPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);
    
    await Empresa.create({
      name,
      headquarters,
      email,
      contact,
      password: hashedPassword,
      active: true,
      firstLogin: true
    });
    
    console.log(`Contraseña temporal para ${email}: ${tempPassword}`);
    
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    res.render('pages/registerEmpresa', { title: 'Registrar Empresa', error: 'Error al registrar la empresa' });
  }
});

module.exports = router;
