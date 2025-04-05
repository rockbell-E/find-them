require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_secreto',
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

const registerRouter = require('./routes/register');
app.use('/', registerRouter);


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/', authRouter);

const empresaRouter = require('./routes/empresa');
app.use('/empresa', empresaRouter);


const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

const cargoRouter = require('./routes/cargo');
app.use('/empresa', cargoRouter);

app.use((req, res, next) => {
  res.status(404).render('errors/404', { title: 'Página no encontrada' });
});

const { sequelize } = require('./models');

sequelize.sync({ alter: true })
  .then(() => {
    console.log('La base de datos se ha sincronizado correctamente.');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar la base de datos:', err);
  });
