import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarCantidadUnidadesDao, eliminarcantidadUnidadesDao, ingresarCantidaUnidaesDao, modificarCantidaUnidaesDao } from "./ordenesprodconfig.dao.js";

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

export const modificarCantidaUnidaesService = async (dataProducto) => {
  try{
    const resModify = await modificarCantidaUnidaesDao(dataProducto);
    if(resModify === 0){
      CustomError(getError(3));
    }

    return resModify;
  }catch(error){

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

export const eliminarcantidadUnidadeServices = async (idProducto) => {
  try {
    const resDelete = await eliminarcantidadUnidadesDao(idProducto);
    if (resDelete === 0) {
      throw new CustomError(getError(4));
    }

    return resDelete;
  } catch (error) {
    throw error;
  }
}