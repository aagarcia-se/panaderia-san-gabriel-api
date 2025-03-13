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
        // Consultar si el producto ya existe en el stock
        const productoExistente = await consultarStockProductoService(dataStockProducto.idProducto);

        // Si el producto no existe, lo registramos
        if (!productoExistente || productoExistente.idStock === 0) {
            
            const stockProductoIngresado = await registrarStockProductoDao(dataStockProducto);
            if(stockProductoIngresado === 0){
                const error = getError(2);
                throw new CustomError(error);
            }

            return stockProductoIngresado;
        }

        // Si el producto existe, actualizamos el stock sumando la nueva cantidad
        const nuevoStock = productoExistente.stock + dataStockProducto.stock;
        const datosActualizados = { idStock: productoExistente.idStock, ...dataStockProducto, stock: nuevoStock };

        const stockProductoActualizado = await actualizarStockProductoDao(datosActualizados);
        if(stockProductoActualizado === 0){
            const error = getError(2);
            throw new CustomError(error);
        } 

        return stockProductoActualizado;
    } catch (error) {
        throw error;
    }
};

export const corregirStockProductosService = async (dataStockProducto) => {
    try{

       // Consultar si el producto ya existe en el stock
       const productoExistente = await consultarStockProductoService(dataStockProducto.idProducto);
       if(!productoExistente || productoExistente.idStock === 0){
           const error = getError(3);
           throw new CustomError(error);
       }

       if(productoExistente.stock < dataStockProducto.stockErroneo){
        const error = getError(20);
        throw new CustomError(error);
        }

       const cantidadCorregida = productoExistente.stock - dataStockProducto.stockErroneo;

       const stockCorregido = cantidadCorregida + dataStockProducto.stockCorrecto;

       const datosActualizados = { idStock: productoExistente.idStock, ...dataStockProducto, stock: stockCorregido }

       const stockActualizado = await actualizarStockProductoDao(datosActualizados);

       return stockActualizado;
    }catch(error){
        throw error;
    }
}