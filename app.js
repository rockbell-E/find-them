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

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/', authRouter);

const adminRouter = require('./routes/admin');
app.use('/admin', adminRouter);

app.use((req, res, next) => {
  res.status(404).render('errors/404', { title: 'Página no encontrada' });
});

const { sequelize } = require('./models');
sequelize.authenticate()
  .then(() => console.log('Conexión establecida correctamente a la base de datos.'))
  .catch(err => console.error('No se pudo conectar a la base de datos:', err));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
