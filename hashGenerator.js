const bcrypt = require('bcrypt');
const saltRounds = 10;
const plainPassword = 'kA4G6IcMR&LM'; //ingresar contraseña para generar hash

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error al hashear la contraseña:', err);
  } else {
    console.log('Hash generado:', hash);
  }
});
