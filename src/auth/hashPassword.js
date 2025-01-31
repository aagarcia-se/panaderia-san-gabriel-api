// authUtils.js
import bcrypt from 'bcrypt';

const saltRounds = 10;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

const comparePassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

export default {hashPassword, comparePassword}