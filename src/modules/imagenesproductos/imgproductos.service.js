import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarImgProductoDao, eliminarImgProductoDao, ingresarImgProductoDao } from "./imgproductos.dao.js";

export const ingresarImgProductoService = async (dataImagenProducto) => {
  try {
    const idImagen = await ingresarImgProductoDao(dataImagenProducto);

    if (idImagen === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return idImagen;
  } catch (error) {
    throw error;
  }
};

export const actualizarImgProductoService = async (dataImagenProducto) => {
  try {
    const result = await actualizarImgProductoDao(dataImagenProducto);
    if (result === 0) {
      const error = getError(3);
      throw new CustomError(error);
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const eliminarImgProductoService = async (idProducto) => {
  try {
    const result = await eliminarImgProductoDao(idProducto);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};
