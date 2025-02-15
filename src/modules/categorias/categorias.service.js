import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarCategoriasDao, ingresarCagetoriaDao } from "./categorias.dao.js";

export const ingresarCategoriaService = async (categoria) => {
  try {
    const categoriaId = await ingresarCagetoriaDao(categoria);

    if (categoriaId === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return categoriaId;
  } catch (error) {
    throw error;
  }
};

export const consultarCategoriasService = async () => {
    try {
      const categorias = await consultarCategoriasDao();
  
      if (categorias.length === 0) {
        const error = getError(1);
        throw new CustomError(error);
      }
  
      return categorias;
    } catch (error) {
      throw error;
    }
  };