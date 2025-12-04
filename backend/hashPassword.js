const bcrypt = require('bcryptjs');

async function hashPassword(plain) {
  const hash = await bcrypt.hash(plain, 12);
  console.log('Hashed password:', hash);
}

hashPassword('adminpass');