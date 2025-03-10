import argon2 from 'argon2'; // Importar argon2

const hashPassword = async (password) => {
  try {
    // Hashear la contraseña con argon2
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
};

const comparePassword = async (password, hash) => {
  try {
    // Verificar la contraseña con argon2
    const match = await argon2.verify(hash, password);
    return match;
  } catch (err) {
    console.error('Error comparing password:', err);
    throw err;
  }
};

export default { hashPassword, comparePassword };