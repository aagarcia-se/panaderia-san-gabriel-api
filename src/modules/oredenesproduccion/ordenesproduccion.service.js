import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarBatchConsumoOrdenProduccionServices } from "../consumosordenesproduccion/consumosordenes.service.js";
import { CalcularCantidadIngredientes } from "../consumosordenesproduccion/cosumoordenesproduccion.utils.js";
import { consultarDetalleOrdenProduccionDao, consultarOrdenProduccionDao, eliminarOrdenProduccionDao, ingresarOrdenProduccionDao } from "./ordenesproduccion.dao.js";
import { procesarDetallesOrden } from "./ordenesproduccion.utils.js";

export const consultarOrdenProduccionService = async () => {
    try {
      const ordenesProduccion = await consultarOrdenProduccionDao();

      if (ordenesProduccion.length === 0) {
        const error = getError(1);
        throw new CustomError(error);
      }

      return ordenesProduccion;
    } catch (error) {
      throw error;
    }
};

export const consultarDetalleOrdenProduccionService = async (idOrdenProduccion) => {
  try {
    const detalleOrden = await consultarDetalleOrdenProduccionDao(idOrdenProduccion);

    if (detalleOrden.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return detalleOrden;
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

export const ingresarOrdenProduccionService = async (ordenProduccion) => {
  try {
    const { encabezadoOrden, detalleOrden } = ordenProduccion;

    // Detalles de la orden de producción con cantidad de unidades por bandeja
    const detallesActualizados = await procesarDetallesOrden(detalleOrden);
    
    const ordenParaDAO = {
      orden: encabezadoOrden,
      detallesOrden: detallesActualizados
    };

    // Ingresar la orden de produccion
    const resultado = await ingresarOrdenProduccionDao(ordenParaDAO); 

    // Generar payload para consumo de ingredientes
    const OrdenProdNew = {
      detallesOrden: resultado.idDetalleOrdenProduccion.map((idDetalle, index) => ({
        idDetalleOrdenProduccion: idDetalle,
        ...detallesActualizados[index]
      }))
    };

    const consumoOrdenProduccion = await CalcularCantidadIngredientes(OrdenProdNew); // Obtener ingredientes y cantidades a consumir
    await registrarBatchConsumoOrdenProduccionServices(consumoOrdenProduccion); // Guardar los ingredientes

    if (resultado.idOrdenGenerada === 0) {
      const errorInfo = getError(2);
      throw new CustomError(errorInfo);
    }

    return resultado;
  } catch (error) {
    throw error;
  }
};


