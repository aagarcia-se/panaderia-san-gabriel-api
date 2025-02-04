import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarPrcioProductoDao, consultarPreciosProductosDao,  elimarPrecioProductoDao,  IngresarPrecioProductoDao } from "./precios.dao.js";


export const ingresarPrecioProductoService = async (dataPrecio) => {
  try {
    const precioProducto = await IngresarPrecioProductoDao(dataPrecio);

    if (precioProducto === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return precioProducto;
  } catch (error) {
    throw error;
  }
};

export const consultarPreciosProductosService = async () => {
  try {
    const preciosProductos = await consultarPreciosProductosDao();

    if (preciosProductos.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return preciosProductos;
  } catch (error) {
    throw error;
  }
};

export const actualizarPrecioProductoService = async (dataPrecio) => {
  try {
    const result = await actualizarPrcioProductoDao(dataPrecio);
    if (result === 0) {
      const error = getError(3);
      throw new CustomError(error);
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const elminarPrecioProductoService = async (idProducto) => {
  try {
    const result = await elimarPrecioProductoDao(idProducto);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};
