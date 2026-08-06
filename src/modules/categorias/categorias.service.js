import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarCategoriaDao, consultarCategoriaConProductosDao, consultarCategoriasDao, eliminarCategoriaDao, ingresarCagetoriaDao } from "./categorias.dao.js";

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

export const actualizarCategoriaService = async (data) => {
  try {
    const resUpdate = await actualizarCategoriaDao(data);

    if(resUpdate === 0){
      const error = getError(3);
      throw new CustomError(error);
    }

    return data.idCategoria;
  } catch (error) {
    throw error;
  }
}

export const eliminarCategoriaService = async (idCategoria) => {
  try {

    const cantidadProductos = await consultarCategoriaConProductosDao(idCategoria);
    if(cantidadProductos >= 1){
      const error = getError(22);
      throw new CustomError(error);
    }

    const resDelete = await eliminarCategoriaDao(idCategoria);
    if(resDelete === 0){
      const error = getError(3);
      throw new CustomError(error);
    }

    return idCategoria;
  } catch (error) {
    throw error;
  }
};