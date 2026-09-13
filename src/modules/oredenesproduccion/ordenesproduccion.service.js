import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarBatchConsumoOrdenProduccionServices } from "../consumosordenesproduccion/consumosordenes.service.js";
import { CalcularCantidadIngredientes, CalcularCantidadIngredientesOptimizado } from "../consumosordenesproduccion/cosumoordenesproduccion.utils.js";
import { consultarRecetaBatchService } from "../recetas/recetas.service.js";
import { elminarStockDiarioService, procesarStockPorOrdenProduccionServices } from "../StockProductos/stockProductos.service.js";
import { actualizarEstadoOrdenProduccionDao, consultarDetalleOrdenPorCriteriosDao, consultarDetalleOrdenProduccionDao, consultarOrdenProduccionDao, consultarUnidadesDeProductoPorOrdenDao, consultarUnidadesDeProductosPorOrdenOptimizadoDao, eliminarOrdenProduccionDao, ingresarOrdenProduccionDao } from "./ordenesproduccion.dao.js";
import { procesarDetallesOrden, procesarDetallesOrdenBatch } from "./ordenesproduccion.utils.js";

export const consultarOrdenProduccionService = async (idRol, idSucursal) => {
    try {
      const ordenesProduccion = await consultarOrdenProduccionDao(idRol, idSucursal);

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

    await elminarStockDiarioService(idOrdenProduccion);

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
    const ordenExist = await consultarDetalleOrdenPorCriteriosService(encabezadoOrden.ordenTurno, encabezadoOrden.fechaAProducir, encabezadoOrden.idSucursal );

    if(ordenExist.encabezadoOrden !== null){
      const errorInfo = getError(19);
      throw new CustomError(errorInfo);
    }
    
    // Detalles de la orden de producción con cantidad de unidades por bandeja
    const detallesActualizados = await procesarDetallesOrden(detalleOrden);
    
    const ordenParaDAO = {
      orden: encabezadoOrden,
      detallesOrden: detallesActualizados
    };

    // Ingresar la orden de produccion
    const resultado = await ingresarOrdenProduccionDao(ordenParaDAO);
    
    if(resultado !== 0){
      ordenParaDAO.orden.idOrden = resultado.idOrdenGenerada;
      await procesarStockPorOrdenProduccionServices(ordenParaDAO);
    }

    // Generar payload para consumo de ingredientes
    const OrdenProdNew = {
      detallesOrden: resultado.idDetalleOrdenProduccion.map((idDetalle, index) => ({
        idDetalleOrdenProduccion: idDetalle,
        ...detallesActualizados[index]
      }))
    };

    const consumoOrdenProduccion = await CalcularCantidadIngredientes(OrdenProdNew); // Obtener ingredientes y cantidades a consumir
    if (consumoOrdenProduccion && consumoOrdenProduccion.length > 0) {
      await registrarBatchConsumoOrdenProduccionServices(consumoOrdenProduccion);
    }

    if (resultado.idOrdenGenerada === 0) {
      const errorInfo = getError(2);
      throw new CustomError(errorInfo);
    }

    return resultado;
  } catch (error) {
    throw error;
  }
};

export const consultarUnidadesDeProductoPorOrdenService = async (idOrdenProduccion, idProducto) => {
  try {
    const detalleOrden = await consultarUnidadesDeProductoPorOrdenDao(idOrdenProduccion, idProducto);

    if (detalleOrden.length === 0) {
      throw new CustomError(getError(1));
    }

    return detalleOrden;
  } catch (error) {
    throw error;
  }
};

export const actualizarEstadoOrdenProduccionServices = async (idOrdenProduccion) => {
  try {

    const ordenActualizada = await actualizarEstadoOrdenProduccionDao(idOrdenProduccion);

    if (ordenActualizada === 0) {
       throw new CustomError(getError(3));
    }

    return ordenActualizada;
  } catch (error) {
    throw error;
  }
};

export const consultarDetalleOrdenPorCriteriosService = async (ordenTurno, fechaAproducir, idSucursal) => {
  try {
    const detalleOrden = await consultarDetalleOrdenPorCriteriosDao(ordenTurno, fechaAproducir, idSucursal);

    if (detalleOrden === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return detalleOrden;
  } catch (error) {
    throw error;
  }
};

// ------------------------------------------------------
// ------------- SERVICIOS OPTIMIZADOS  -----------------
//-------------------------------------------------------
export const consultarUnidadesDeProductosPorOrdenOptimizadoService = async (idOrdenProduccion, idsProductos) => {
    try {
        const detalles = await consultarUnidadesDeProductosPorOrdenOptimizadoDao(idOrdenProduccion, idsProductos);

        // Lógica de negocio en el service
        const detallesMap = new Map(detalles.map(d => [d.idProducto, d]));

        return {
            getDetalleOrden: (idProducto) => detallesMap.get(idProducto) ?? { idDetalleOrdenProduccion: 0 }
        };
    } catch (error) {
        throw error;
    }
};

export const ingresarOrdenProduccionServiceVersion2 = async (ordenProduccion) => {
  try {
      const { encabezadoOrden, detalleOrden } = ordenProduccion;

      const ordenExist = await consultarDetalleOrdenPorCriteriosService(
          encabezadoOrden.ordenTurno,
          encabezadoOrden.fechaAProducir,
          encabezadoOrden.idSucursal
      );

      if (ordenExist.encabezadoOrden !== null) {
          const errorInfo = getError(19);
          throw new CustomError(errorInfo);
      }

      const detallesActualizados = await procesarDetallesOrdenBatch(detalleOrden);

      const resultado = await ingresarOrdenProduccionDao({orden: encabezadoOrden, detallesOrden: detallesActualizados });

      if (resultado.idOrdenGenerada === 0) {
          const errorInfo = getError(2);
          throw new CustomError(errorInfo);
      }

      const OrdenProdNew = {
          detallesOrden: resultado.idDetalleOrdenProduccion.map((idDetalle, index) => ({
              idDetalleOrdenProduccion: idDetalle,
              ...detallesActualizados[index]
          }))
      };

      const consumoOrdenProduccion = await CalcularCantidadIngredientesOptimizado(OrdenProdNew);

      if (consumoOrdenProduccion && consumoOrdenProduccion.length > 0) {
          await registrarBatchConsumoOrdenProduccionServices(consumoOrdenProduccion);
      }

      // Releer encabezado + detalle recién insertados, usando la misma
      // consulta que sirve el endpoint de consulta — mismo shape siempre.
      const detalleOrdenCompleto = await consultarDetalleOrdenProduccionService(resultado.idOrdenGenerada);

      // Índice por idDetalleOrdenProduccion para cruzar consumo -> producto
      // (nombre y cantidad producida), sin volver a consultar la BD.
      const detallePorId = new Map(
          detalleOrdenCompleto.detalleOrden.map((d) => [d.idDetalleOrdenProduccion, d])
      );

      const idsProductos = detalleOrdenCompleto.detalleOrden.map((d) => d.idProducto);

      // Trae las recetas (con nombreIngrediente) de los productos de esta
      // orden — se usa solo como catálogo para traducir idIngrediente ->
      // nombreIngrediente, no como fuente del consumo en sí.
      const recetasPorProducto = await consultarRecetaBatchService(idsProductos);
      const nombreIngredientePorId = new Map();
      for (const filas of recetasPorProducto.values()) {
          for (const fila of filas) {
              nombreIngredientePorId.set(fila.idIngrediente, fila.nombreIngrediente);
          }
      }

      // Shape final que espera el frontend para generar el PDF — el mismo
      // que devuelve /consultar-consumo-ingredientes.
      const ingredientesConsumidos = consumoOrdenProduccion.map((item) => {
          const detalleProducto = detallePorId.get(item.idDetalleOrdenProduccion);
          const cantidadProducida = detalleProducto
              ? (detalleProducto.cantidadUnidades || detalleProducto.cantidadHarina)
              : null;

          return {
              OrdenID: resultado.idOrdenGenerada,
              FechaProduccion: encabezadoOrden.fechaAProducir,
              Producto: detalleProducto?.nombreProducto ?? '',
              CantidadProducida: cantidadProducida,
              Ingrediente: nombreIngredientePorId.get(item.idIngrediente) ?? '',
              CantidadUsada: item.cantidadUsada,
              UnidadMedida: item.unidadMedida,
              FechaConsumo: item.fechaCreacion,
          };
      });

      return {
          idOrdenGenerada: resultado.idOrdenGenerada,
          detalleOrden: detalleOrdenCompleto,
          ingredientesConsumidos
      };
  } catch (error) {
      throw error;
  }
};
