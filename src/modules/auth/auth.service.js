import CustomError from "../../utils/CustomError.js";
import { iniciarSesionDao } from "./auth.dao.js";
import jwtService from "../../utils/jwtService.js";
import { getError } from "../../utils/generalErrors.js";


export const iniciarSesionService = async (data) => {
    try {
      const usuarioLogin = await iniciarSesionDao(data);
  
      if (usuarioLogin === 0) {
        const error = getError(8);
        throw new CustomError(error);
      }
      const autenticateUser = jwtService.generateToken(usuarioLogin);
  
      return autenticateUser;
    } catch (error) {
      throw error;
    }
  }