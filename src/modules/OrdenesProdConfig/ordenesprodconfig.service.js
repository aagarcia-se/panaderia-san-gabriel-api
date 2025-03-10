import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarCantidadUnidadesDao, ingresarCantidaUnidaesDao } from "./ordenesprodconfig.dao.js";

export const ingrearCantidadUnidadesService = async (dataProducto) => {
  try{

    const idConfig = ingresarCantidaUnidaesDao(dataProducto);
    if (idConfig === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return idConfig;

  }catch(error){
    throw error;
  }
}

export const consultarCantidadUnidadesService = async (idProducto) => {
  try {
    const unidadesPorBandeja = await consultarCantidadUnidadesDao(idProducto);

    return unidadesPorBandeja;
  } catch (error) {
    throw error;
  }
};
