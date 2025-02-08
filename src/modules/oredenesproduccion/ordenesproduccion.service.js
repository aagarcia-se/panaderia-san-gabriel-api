import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarDetalleOrdenProduccionDao } from "./ordenesproduccion.dao.js";

export const consultarDetalleOrdenProduccionService = async () => {
    try {
      const ordenesProduccion = await consultarDetalleOrdenProduccionDao();
  
      if (ordenesProduccion.length === 0) {
        const error = getError(1);
        throw new CustomError(error);
      }
  
      return ordenesProduccion;
    } catch (error) {
      throw error;
    }
  };