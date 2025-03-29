import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarCantidadUnidadesService, ingrearCantidadUnidadesService, modificarCantidaUnidaesService } from "../OrdenesProdConfig/ordenesprodconfig.service.js";
import { crearProductoDao, actualizarProductoDao, consultarProductosDao, eliminarProductoDao, desactivarProductoDao } from "./productos.dao.js";


export const crearProductoService = async (dataProducto) => {
  try {
    const productoCreado = await crearProductoDao(dataProducto);

    if (productoCreado === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    if(dataProducto.idCategoria == 1){
      dataProducto.idProducto = productoCreado;
      await ingrearCantidadUnidadesService(dataProducto);
    }

    return productoCreado;
  } catch (error) {
    throw error;
  }
};

export const consultarProductoService = async () => {
  try {
    const productos = await consultarProductosDao();

    if (productos.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return productos;
  } catch (error) {
    throw error;
  }
};

export const actualizarProductoService = async (dataProducto) => {
  try {
    const result = await actualizarProductoDao(dataProducto);
    if (result === 0) {
      const error = getError(3);
      throw new CustomError(error);
    }

    if(dataProducto.idCategoria === 1 && dataProducto.tipoProduccion === "bandejas"){

      const res = await consultarCantidadUnidadesService(dataProducto.idProducto);
      if(res === 0){
        await ingrearCantidadUnidadesService(dataProducto);
      }else{
        await modificarCantidaUnidaesService(dataProducto);
      }
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const elminarProductoService = async (idProducto) => {
  try {
    const result = await eliminarProductoDao(idProducto);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const desactivarProductoService = async (idProducto) => {
  try {
    const result = await desactivarProductoDao(idProducto);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};
