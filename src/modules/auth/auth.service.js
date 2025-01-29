import { iniciarSesionDao } from "./auth.dao.js";


export const iniciarSesionService = async (data) => {
    try {
      const usuarioLogin = await iniciarSesionDao(data);
  
      if (usuarioLogin.length === 0) {
        const error = getError(1);
        throw new CustomError(error);
      }
  
      return usuarioLogin;
    } catch (error) {
      throw error;
    }
  }