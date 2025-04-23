import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarRecetaDao, consultarRecetaDao, consultarRecetasDao, elminarRecetaDao, ingresarRecetaDao } from "./recetas.dao.js";

export const consultarRecetasService = async () => {
  try {
      const receta = await consultarRecetasDao();
      if(receta === 0){
          const errorInfo = getError(1);
          throw new CustomError(errorInfo);
      }

    return receta;
  } catch (error) {
    throw error;
  }
};

export const consultarRecetaService = async (idProducto) => {
    try {
        const receta = await consultarRecetaDao(idProducto);
        if(receta === 0){
            const errorInfo = getError(1);
            throw new CustomError(errorInfo);
        }
  
      return receta;
    } catch (error) {
      throw error;
    }
};

export const ingresarRecetaService = async (receta) => {
    try {
      const recetaCreada = await ingresarRecetaDao(receta);
      if(!recetaCreada){
        const errorInfo = getError(2);
        throw new CustomError(errorInfo);
      }
  
      return recetaCreada;
    } catch (error) {
      throw error;
    }
}

export const actualizarRecetaService = async (receta) => {
  try {
    // 1. Llamar al DAO para actualizar la receta
    const resultado = await actualizarRecetaDao(receta);

    // 2. Verificar si la actualización fue exitosa
    if (resultado === 0) {
      const errorInfo = getError(3); // Código de error para "No se pudo actualizar la receta"
      throw new CustomError(errorInfo);
    }

    // 3. Retornar la receta actualizada
    return resultado;
  } catch (error) {
    throw error;
  }
};

export const eliminarRecetaService = async (receta) => {
  try {
    // 1. Llamar al DAO para eliminar la receta
    const resultado = await elminarRecetaDao(receta);

    // 2. Verificar si la eliminación fue exitosa
    if (resultado === 0) {
      const errorInfo = getError(4); // Código de error para "No se pudo eliminar la receta"
      throw new CustomError(errorInfo);
    }

    // 3. Retornar la receta eliminada
    return resultado;
  } catch (error) {
    throw error;
  }
}