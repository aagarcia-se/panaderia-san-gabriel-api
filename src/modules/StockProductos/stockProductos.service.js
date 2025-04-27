import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarDetalleOrdenProduccionService } from "../oredenesproduccion/ordenesproduccion.service.js";
import { actualizarStockProductoDao, actualizarStockProductoDiarioDao, consultarStockDiarioPorSucursalDao, consultarStockProductoDao, consultarStockProductoDiarioDao, consultarStockProductosDao, IngresarHistorialStockDao, registrarStockProductoDao, registrarStockProductoDiarioDao } from "./stockProductos.dao.js";
import { crearPayloadActualizarDebitoStockDiario, crearPayloadActualizarDebitoStockGeneral, crearPayloadHistorial, crearPayloadStockProductoDiarioExistente, crearPayloadStockProductoDiarioInexistente, payloadStockDiarioIngresoManualExistente, payloadStockDiarioIngresoManualInexistente, payloadStockProductoExistente, payloadStockProductoInexistente } from "./stockProductos.utils.js";

/*------------------------------------------------------------------------------
--------------------- Control de stock suma de productos -----------------------
--------------------------------------------------------------------------------*/
export const consultarStockProductoService = async (idProducto, idSucursal) => {
  try {
    const stockProducto = await consultarStockProductoDao(idProducto, idSucursal);

    if (!stockProducto) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return stockProducto;
  } catch (error) {
    throw error;
  }
}

export const consultarStockProductosService = async (idSucursal) => {
  try {
    const stockProductos = await consultarStockProductosDao(idSucursal);

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

          //control de stock general
          if(stockProducto.controlarStock === 1 && stockProducto.controlarStockDiario === 0 ){

            // Consultar si el producto ya existe en el stock
            const productoExistente = await consultarStockProductoDao(stockProducto.idProducto, stockProducto.idSucursal);
            if(productoExistente.idStock === 0){
              const datosActualizados = payloadStockProductoInexistente(stockProducto);
              
              // Registrar el historial de stock
              const insertHistorialStock = await IngresarHistorialStockDao(datosActualizados);

              if (insertHistorialStock === 0) {
                throw new CustomError(getError(2)); // Error al registrar
              }

              const operacionStock =  await registrarStockProductoDao(datosActualizados);

              if (operacionStock === 0) {
                throw new CustomError(getError(2)); // Error al registrar o actualizar
              }

              return operacionStock;

            }else{
              const datosActualizados =payloadStockProductoExistente(productoExistente, stockProducto)

              // Registrar el historial de stock
              const insertHistorialStock = await IngresarHistorialStockDao(datosActualizados);
              
              if (insertHistorialStock === 0) {
                throw new CustomError(getError(2)); // Error al registrar
              }

              const operacionStock = await actualizarStockProductoDao(datosActualizados);
              
              if (operacionStock === 0) {
                throw new CustomError(getError(2)); // Error al registrar o actualizar
              }

              return operacionStock;
            }

          }else if(stockProducto.controlarStock === 0 && stockProducto.controlarStockDiario === 1 ){
            

            const StockExistente = await consultarStockProductoDiarioDao(stockProducto.idProducto, stockProducto.idSucursal, stockProducto.fechaCreacion);
            if (StockExistente.idStockDiario === 0) {
        
              const payloadStockDiarioNuevo = payloadStockDiarioIngresoManualInexistente(stockProducto);

              // Registrar el historial de stock
              const insertHistorialStock = await IngresarHistorialStockDao(payloadStockDiarioNuevo);

              if (insertHistorialStock === 0) {
                throw new CustomError(getError(2)); // Error al registrar
              }

              await registrarStockProductoDiarioDao(payloadStockDiarioNuevo);
            } else {
              const payloadStockDiarioExistente = payloadStockDiarioIngresoManualExistente(StockExistente, stockProducto);
             
              // Registrar el historial de stock
              const insertHistorialStock = await IngresarHistorialStockDao(payloadStockDiarioExistente);

              if (insertHistorialStock === 0) {
                throw new CustomError(getError(2)); // Error al registrar
              }
             
              await actualizarStockProductoDiarioDao(payloadStockDiarioExistente);
          }

          }

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
                  throw error; // Propagar el error si es necesario
              }
          })
      );
  } catch (error) {
      throw error;
  }
};

/*------------------------------------------------------------------------------
---------- Control de stock productos ingreso ordenes de produccion ------------
-------------------------- (Suma de productos) ---------------------------------*/
export const procesarStockPorOrdenProduccionServices = async (ordenProduccion) => {
  try{
    const {orden, detallesOrden} = ordenProduccion;
    const idSucursal = orden.idSucursal;
    const fechaValidez = orden.fechaAProducir;

    return Promise.all(
      detallesOrden.map( async (detalle) => {
        
        if (detalle.tipoProduccion === "bandejas" && detalle.controlarStockDiario === 1 && detalle.controlarStock === 0 ) {
          // Consultar si ya existe el producto en stockDiarios 
          const StockExistente = await consultarStockProductoDiarioDao(detalle.idProducto, idSucursal, fechaValidez);
          
          if (StockExistente.idStockDiario === 0) {
              const payloadStockDiarioNuevo = crearPayloadStockProductoDiarioInexistente(orden, detalle);

              //const payloadHistorial = crearPayloadHistorial(payloadStockDiarioNuevo, null, 1, 2, 2);
              // Registrar el historial de stock
              //const insertHistorialStock = await IngresarHistorialStockDao(payloadHistorial);
              //if (insertHistorialStock === 0) {
              //  throw new CustomError(getError(2)); // Error al registrar
              //}

              await registrarStockProductoDiarioDao(payloadStockDiarioNuevo);
          } else {
              const payloadStockDiarioExistente = crearPayloadStockProductoDiarioExistente(orden, detalle, StockExistente);
              
              //const payloadHistorial = crearPayloadHistorial(payloadStockDiarioExistente, StockExistente, 1, 2, 2);
              // Registrar el historial de stock
              //const insertHistorialStock = await IngresarHistorialStockDao(payloadHistorial);
              //if (insertHistorialStock === 0) {
              //  throw new CustomError(getError(2)); // Error al registrar
              //}

              await actualizarStockProductoDiarioDao(payloadStockDiarioExistente);
          }
        }else if(detalle.tipoProduccion === "bandejas" && detalle.controlarStock === 1 && detalle.controlarStockDiario === 0){

        }

      })
    );
  }catch(error){
    throw error;
  }
}

export const consultarStockDiarioPorSucursalService = async (idSucursal, fecha) => {
  try {
    const stockDiario = await consultarStockDiarioPorSucursalDao(idSucursal, fecha);

    if (stockDiario.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return stockDiario;
  } catch (error) {
    throw error;
  }
}


/*------------------------------------------------------------------------------
--------------------- Control de stock ventas de productos ---------------------
------------------------------ (Resta de stock) -------------------------------*/
export const descontarStockPorVentas = async (venta) => {
  try {
    const {encabezadoVenta, detallesVenta} = venta;

    Promise.all(
      detallesVenta.map(async (detalle) => {
        try{

          if(detalle.controlarStock === 1 && detalle.controlarStockDiario === 0){
            const StockExistente = await consultarStockProductoDao(detalle.idProducto, encabezadoVenta.idSucursal);
            
            if(StockExistente.idStock !== 0){
              const paylodDescStockGeneral = crearPayloadActualizarDebitoStockGeneral(StockExistente, detalle, encabezadoVenta.idSucursal);
              const resUpdateStockGeneral = await actualizarStockProductoDao(paylodDescStockGeneral);
            
            }else{

              // se espera otra logica para el debito de stock general

            }

          }else{
            const stockDiarioExistente = await consultarStockProductoDiarioDao(detalle.idProducto, encabezadoVenta.idSucursal, encabezadoVenta.fechaCreacion);
            
            if(stockDiarioExistente.idStockDiario !== 0){
              const payloadDescStockDiario = crearPayloadActualizarDebitoStockDiario(stockDiarioExistente, detalle, encabezadoVenta.idSucursal);
              const resUpdateStockDiario = await actualizarStockProductoDiarioDao(payloadDescStockDiario);
           
            }else{

              // se espera otra logica para el debito de stock general

            }
          }


        }catch(error){
          throw error; // Propagar el error si es necesario
        }
      })
    );
  } catch (error) {
    throw error;
  }
}

export const elminarStockDiarioService = async (idOrdenProduccion) => {
  try{

    const orden = await consultarDetalleOrdenProduccionService(idOrdenProduccion)
    const {encabezadoOrden} = orden;
    const productosOrden = orden.detalleOrden;

    return Promise.all(
      productosOrden.map( async (productoOrden) => {
        try{

          const productoStock = await consultarStockProductoDiarioDao(productoOrden.idProducto, encabezadoOrden.idSucursal, encabezadoOrden.fechaAProducir);
          
          if(productoStock.idStockDiario !== 0 && productoStock.stock > 0){
            const payloadElminar = {
              idProducto: productoOrden.idProducto,
              idSucursal: encabezadoOrden.idSucursal,
              stock: productoStock.stock - productoOrden.cantidadUnidades || 0,
              fechaActualizacion: encabezadoOrden.fechaCreacion,
              fechaValidez: encabezadoOrden.fechaAProducir,
            }
  
            const stockElinado = await actualizarStockProductoDiarioDao(payloadElminar);

            return stockElinado;
          }
          

        }catch(error){
          throw error
        }
      })
    );


  }catch(error){
    throw error;
  }
}