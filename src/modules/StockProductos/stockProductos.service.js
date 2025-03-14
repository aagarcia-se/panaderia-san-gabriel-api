import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarStockProductoDao, consultarStockProductoDao, consultarStockProductosDao, registrarStockProductoDao } from "./StockProductos.dao.js";


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

          // Si el producto no existe, lo registramos
          if (!productoExistente || productoExistente.idStock === 0) {
            const stockProductoIngresado = await registrarStockProductoDao(stockProducto);
            if (stockProductoIngresado === 0) {
              throw new CustomError(getError(2)); // Error al registrar
            }
            return stockProductoIngresado;
          }

          // Si el producto existe, actualizamos el stock sumando la nueva cantidad
          const nuevoStock = productoExistente.stock + stockProducto.stock;
          const datosActualizados = {
            idStock: productoExistente.idStock,
            ...stockProducto,
            stock: nuevoStock,
          };

          const stockProductoActualizado = await actualizarStockProductoDao(datosActualizados);
          if (stockProductoActualizado === 0) {
            throw new CustomError(getError(2)); // Error al actualizar
          }

          return stockProductoActualizado;
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
        // 1. Consultar si el producto ya existe en el stock
        const productoExistente = await consultarStockProductoService(dataStockProducto.idProducto);

        // 2. Si el producto no existe, lanzar un error
        if (!productoExistente || productoExistente.idStock === 0) {
            const error = getError(3); // Producto no encontrado
            throw new CustomError(error);
        }

        // 3. Calcular el stock corregido
        const stockCorregido = (productoExistente.stock - dataStockProducto.stockErroneo) + dataStockProducto.stockCorrecto;

        // 4. Validar si la resta da un número negativo
        if (stockCorregido < 0) {
            const error = getError(20); // La corrección daría un stock negativo
            throw new CustomError(error);
        }
        // 5. Validar si el stock corregido es negativo
        if (stockCorregido < 0) {
            const error = getError(21); // El stock corregido es negativo
            throw new CustomError(error);
        }

        // 8. Actualizar el stock en la base de datos
        const datosActualizados = {
            idStock: productoExistente.idStock,
            ...dataStockProducto,
            stock: stockCorregido
        };

        const stockActualizado = await actualizarStockProductoDao(datosActualizados);

        // 9. Retornar el stock actualizado
        return stockActualizado;
    } catch (error) {
        // 10. Relanzar el error para que sea manejado en un nivel superior
        throw error;
    }
};
