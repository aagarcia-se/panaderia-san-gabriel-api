import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarStockProductoDao, consultarStockProductoDao, consultarStockProductosDao, IngresarHistorialStockDao, registrarStockProductoDao } from "./stockProductos.dao.js";
import { calcularStockActualizado, payloadStockProductoExistente, payloadStockProductoInexistente } from "./stockProductos.utils.js";


export const consultarStockProductoService = async (idProducto) => {
  try {
    const stockProducto = await consultarStockProductoDao(idProducto);

    if (!stockProducto) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return stockProducto;
  } catch (error) {
    throw error;
  }
}

export const consultarStockProductosService = async () => {
  try {
    const stockProductos = await consultarStockProductosDao();

    if (stockProductos.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return stockProductos;
  } catch (error) {
    throw error;
  }
}

export const registrarStockProductosService = async (dataStockProducto) => {
  try {

    // Validar que stockProductos sea un array
    if (!Array.isArray(dataStockProducto.stockProductos)) {
      throw new CustomError(getError(3)); // Define un error adecuado para este caso
    }

    const stockProductos = dataStockProducto.stockProductos;

    // Procesar cada producto en paralelo
    return Promise.all(
      stockProductos.map(async (stockProducto) => {
        try {
          // Consultar si el producto ya existe en el stock
          const productoExistente = await consultarStockProductoDao(stockProducto.idProducto);   

          // Determinar los datos actualizados según si el producto existe o no
          const datosActualizados =  productoExistente.idStock !== 0
            ? payloadStockProductoExistente(productoExistente, stockProducto)
            : payloadStockProductoInexistente(stockProducto);

          // Registrar el historial de stock
          const insertHistorialStock = await IngresarHistorialStockDao(datosActualizados);
          if (insertHistorialStock === 0) {
            throw new CustomError(getError(2)); // Error al registrar
          }

          // Registrar o actualizar el stock del producto
          const operacionStock = productoExistente && productoExistente.idStock !== 0
            ? await actualizarStockProductoDao(datosActualizados)
            : await registrarStockProductoDao(datosActualizados);

          if (operacionStock === 0) {
            throw new CustomError(getError(2)); // Error al registrar o actualizar
          }

          return operacionStock;
        } catch (error) {
          throw error; // Propagar el error si es necesario
        }
      })
    );
  } catch (error) {
    throw error;
  }
};

export const corregirStockProductosService = async (dataStockProducto) => {
  try {
      // Validar que stockProductos sea un array
      if (!Array.isArray(dataStockProducto.stockProductos)) {
          throw new CustomError(getError(3)); // Define un error adecuado para este caso
      }

      const stockProductos = dataStockProducto.stockProductos;

      return Promise.all(
          stockProductos.map(async (stockProductos) => {
              try {
                  // 1. Consultar si el producto ya existe en el stock
                  const productoExistente = await consultarStockProductoService(stockProductos.idProducto);

                  // 2. Si el producto no existe, lanzar un error
                  if (!productoExistente || productoExistente.idStock === 0) {
                      const error = getError(3); // Producto no encontrado
                      throw new CustomError(error);
                  }

                  // 4. Calcular el stock corregido
                  const stockCorregido = (productoExistente.stock - stockProductos.stockErroneo) + stockProductos.stockCorrecto;

                  // 5. Validar si el stock corregido es negativo
                  if (stockCorregido < 0) {
                      const error = getError(20); // La corrección daría un stock negativo
                      throw new CustomError(error);
                  }

                  // 6. Actualizar el stock en la base de datos
                  const datosActualizados = {
                      idStock: productoExistente.idStock,
                      ...stockProductos, // Copia todas las propiedades de stockProductos
                      stock: stockCorregido // Sobrescribe o agrega la propiedad "stock"
                  };

                  const stockActualizado = await actualizarStockProductoDao(datosActualizados);

                  // 7. Retornar el stock actualizado
                  return stockActualizado;
              } catch (error) {
                  // Manejar errores individuales para cada producto
                  console.error(`Error corrigiendo el stock del producto ${stockProductos.idProducto}:`, error);
                  throw error; // Propagar el error si es necesario
              }
          })
      );
  } catch (error) {
      // Manejar errores generales
      console.error('Error en corregirStockProductosService:', error);
      throw error;
  }
};

/**esta es una preuba de pull para probar las libresrias instaladas */
