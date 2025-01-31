import CustomError from "../../utils/CustomError.js";
import { iniciarSesionDao } from "./auth.dao.js";
import { getError } from "../../utils/generalErrors.js";
import jwt from "../../auth/jwt.js";
import hashPassword from "../../auth/hashPassword.js";

export const iniciarSesionService = async (data) => {

  try {
    // 1. Obtener los datos del usuario desde el DAO
    const usuarioLogin = await iniciarSesionDao(data.usuario);

    // 2. Verificar si el usuario existe
    if (!usuarioLogin) {
      throw new CustomError(getError(9));// Código de error para "Usuario no encontrado"
    }

    // 3. Validar la contraseña
    const isValid = await hashPassword.comparePassword(data.contrasena, usuarioLogin.contrasena);
    if (!isValid) {
      throw new CustomError(getError(10));// Código de error para "Contraseña incorrecta"
    }

    // 4. Eliminar la contraseña del objeto de respuesta (por seguridad)
    delete usuarioLogin.contrasena;

    // 5. Generar el token JWT
    const autenticateUser = jwt.generateToken(usuarioLogin);
  
    // 6. Retornar el token y los datos del usuario (sin la contraseña)
    return autenticateUser;
  } catch (error) {
    throw error;
  }
};