const bcrypt = require('bcrypt');
const { User, Empresa } = require('../models');

const getLogin = (req, res) => {
  res.render('pages/login', { title: 'Iniciar Sesión', error: null });
};

const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ where: { email } });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Contraseña incorrecta' });
      }
      req.session.user = { id: user.id, email: user.email, role: user.role };
      return res.redirect('/admin/dashboard');
    }

    let empresa = await Empresa.findOne({ where: { email, active: true } });
    if (empresa) {
      const match = await bcrypt.compare(password, empresa.password);
      if (!match) {
        return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Contraseña incorrecta' });
      }
      req.session.user = { id: empresa.id, email: empresa.email, role: 'empresa', firstLogin: empresa.firstLogin, companyId: empresa.id };
      if (empresa.firstLogin) {
        return res.redirect('/empresa/changePassword');
      }
      return res.redirect('/empresa/dashboard');
    }

    return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Usuario no encontrado' });
  } catch (error) {
    console.error(error);
    return res.render('pages/login', { title: 'Iniciar Sesión', error: 'Error al iniciar sesión' });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/login');
};

module.exports = { getLogin, postLogin, logout };
