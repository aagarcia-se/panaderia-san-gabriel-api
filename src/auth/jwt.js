import jwt from "jsonwebtoken";
import CustomError from "../utils/CustomError.js";
import { getError } from "../utils/generalErrors.js";


const generateToken = (usuarioAuth) => {
  return jwt.sign(
    {
      usuario: usuarioAuth.usuario,  // Se incluye el objeto usuario
      permisos: usuarioAuth.permisos // Se incluye el array de permisos
    },
    process.env.JWT_SECRET, // Se obtiene de las variables de entorno
    { expiresIn: process.env.JWT_EXPIRES_IN } // Tiempo de expiración del token
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    let tokenError;

    if (error.name === "TokenExpiredError") {
      // Lanza un error con el mensaje de expiración del token
      tokenError = getError(5);
      throw new CustomError(tokenError);
    }
    // Lanza un error para otros tipos de error (token inválido, etc.)
    tokenError = getError(6);
    throw new CustomError(tokenError);
  }
};


// Exporta la función por defecto
export default { generateToken, verifyToken };
