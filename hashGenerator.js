const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = '123'; //ingresar contraseña para generar hash

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al hashear la contraseña:', err);
  } else {
    console.log('Hash generado:', hash);
  }
});
