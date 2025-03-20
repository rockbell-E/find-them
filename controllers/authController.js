// controllers/authController.js
const bcrypt = require('bcrypt');
const { User } = require('../models');

const getLogin = (req, res) => {
  res.render('pages/login', { title: 'Iniciar Sesión', error: null });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Usuario no encontrado' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Contraseña incorrecta' });
    }
    req.session.user = { id: user.id, email: user.email, role: user.role };
    if (user.role === 'admin') {
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/empresa/dashboard');
    }
  } catch (error) {
    console.error(error);
    res.render('pages/login', { title: 'Iniciar Sesión', error: 'Error al iniciar sesión' });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

module.exports = { getLogin, postLogin, logout };
