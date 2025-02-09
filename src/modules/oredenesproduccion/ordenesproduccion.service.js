import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarDetalleOrdenProduccionDao, eliminarOrdenProduccionDao } from "./ordenesproduccion.dao.js";

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

export const eliminarOrdenProduccionService = async (idOrdenProduccion) => {
  try {
    const result = await eliminarOrdenProduccionDao(idOrdenProduccion);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};