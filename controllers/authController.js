
const bcrypt = require('bcrypt');
const { User } = require('../models');

const getLogin = (req, res) => {
  res.render('pages/login', { title: 'Iniciar Sesión' });
};

const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Usuario no encontrado' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Contraseña incorrecta' });
    }
    req.session.user = { id: user.id, username: user.username, role: user.role, companyId: user.companyId };

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
