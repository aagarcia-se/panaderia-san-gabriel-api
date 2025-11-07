import CustomError from "../../utils/CustomError.js";
import { obtenerSoloFecha } from "../../utils/date.utils.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarEliminacionPorDia, registrarVentaEliminadaDao } from "../eliminacionesTracking/eliminacionesdiarias.dao.js";
import { detalleVentaEliminadaPayload } from "../eliminacionesTracking/eliminacionesdiarias.utils.js";
import { ingresarGastosDiariosService } from "../GastosDiarios/gastosDiarios.service.js";
import { registrarIngresoDiarioPorTurnoService } from "../ingresos/ingresos.service.js";
import { crearPayloadingresos } from "../ingresos/ingresos.utils.js";
import { actuailizarEstadoOrdenProd } from "../oredenesproduccion/ordenesproduccion.dao.js";
import { actualizarEstadoOrdenProduccionServices } from "../oredenesproduccion/ordenesproduccion.service.js";
import { ingresarSobranteService } from "../sobrantes/sobrantes.service.js";
import { actualizarStockProductoDao, actualizarStockProductoDiarioDao, consultarStockProductoDao, consultarStockProductoDiarioDao, IngresarHistorialStockDao } from "../StockProductos/stockProductos.dao.js";
import { descontarStockPorVentas } from "../StockProductos/stockProductos.service.js";
import { consultarDetalleVentaDao, consultarVentaporId, consultarVentasPorUsuarioDao, eliminarVentaDao, ingresarVentaDao, } from "./ventas.dao.js";
import { crearPayloadSobrante, procesarVentaService } from "./ventas.utils.js";

export const ingresarVentaService = async (venta) => {
  try {
    // Procesar detalles de la venta antes de ingresarla
    const ventaDetalleProcesado = await procesarVentaService(venta);
    
    // Guardar la venta en la base de datos
    const resVenta = await ingresarVentaDao(ventaDetalleProcesado);

    if (resVenta === 0) {
      throw new CustomError(getError(2));
    }

    /* Ingresar sobrantes */
    const paylodSobrante = crearPayloadSobrante(resVenta.idVenta, venta.detalleVenta);
    await ingresarSobranteService(paylodSobrante);

    await descontarStockPorVentas(ventaDetalleProcesado);//debitar stock de las ventas ingresadas

    const detalleingreso = crearPayloadingresos(resVenta.idVenta, ventaDetalleProcesado);

    await registrarIngresoDiarioPorTurnoService(detalleingreso);

    if(venta.gastosDiarios && venta.gastosDiarios.detalleGastosDiarios){
      await ingresarGastosDiariosService(resVenta.idVenta, venta.gastosDiarios);
    }

    if (venta.encabezadoVenta.idOrdenProduccion) {
      await actualizarEstadoOrdenProduccionServices(resVenta.encabezadoVenta.idOrdenProduccion);
    }

    return resVenta;
  } catch (error) {
    throw error;
  }
};

export const consultarVentasPorUsuarioService = async (idUsuariol) => {
  try {
    const ventas = await consultarVentasPorUsuarioDao(idUsuariol);

    if (ventas.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return ventas;
  } catch (error) {
    throw error;
  }
};

export const consultarDetalleVentaService = async (idVenta) => {
  try{

    const venta = await consultarDetalleVentaDao(idVenta);
    if (venta === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return venta;
  }catch(error){
    throw error;
  }
}

export const eliminarVentaService = async (idVenta) => {
  try {
    await revertirVentaServices(idVenta);

    const ventaPorId = await consultarVentaporId(idVenta);
    const detalleVenta = await consultarDetalleVentaDao(idVenta);


    const resElminacion = await eliminarVentaDao(idVenta);
    if (resElminacion === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

   const eliminacionTracking = {
    procesoEliminado: 'VENTA',
    idReferencia: idVenta,
    idUsuario: ventaPorId.idUsuario,
    idSucursal: ventaPorId.idSucursal,
    turno: ventaPorId.ventaTurno,
    fechaEliminacion: ventaPorId.fechaVenta
   }

   await registrarEliminacionPorDia(eliminacionTracking);

   const detalleEliminacion = detalleVentaEliminadaPayload(detalleVenta);

   await registrarVentaEliminadaDao(detalleEliminacion);

  return resElminacion;
  } catch (error) {
    throw error;
  }
};

export const revertirVentaServices = async (idVenta) => {
    try{
        const detalleProductosVenta = await consultarDetalleVentaDao(idVenta)
        const {encabezadoVenta, detalleVenta} = detalleProductosVenta;

        await actuailizarEstadoOrdenProd( encabezadoVenta.fechaVenta, encabezadoVenta.ventaTurno );

        return Promise.all(
            detalleVenta.map( async (producto) => {
              
                try{

                  if(producto.controlarStock === 1 && producto.controlarStockDiario === 0){
                    const productoEnStock = await consultarStockProductoDao(producto.idProducto, encabezadoVenta.idSucursal);

                    const payloadRevertir = {
                        idSucursal: encabezadoVenta.idSucursal,
                        idProducto: producto.idProducto,
                        stock: productoEnStock.stock + producto.cantidadVendida,
                        fechaActualizacion: encabezadoVenta.fechaVenta
                    }

                    await actualizarStockProductoDao(payloadRevertir);

                    const payloadHistorial = {
                        idUsuario: encabezadoVenta.idUsuario,
                        idProducto: producto.idProducto,
                        idSucursal: encabezadoVenta.idSucursal,
                        tipoMovimiento: 'INGRESO',
                        stockAnterior: productoEnStock.stock,
                        cantidad: producto.cantidadVendida,
                        stockNuevo: productoEnStock.stock + producto.cantidadVendida,
                        fechaActualizacion: encabezadoVenta.fechaVenta,
                        observaciones: 'Revertir venta por eliminacion',
                        tipoReferencia: 'VENTA'
                    }

                    await IngresarHistorialStockDao(payloadHistorial);

                  }else{
                    const productoEnStockDiario = await consultarStockProductoDiarioDao(producto.idProducto, encabezadoVenta.idSucursal, obtenerSoloFecha(encabezadoVenta.fechaVenta));

                    const payloadRevertir = {
                        idSucursal: encabezadoVenta.idSucursal,
                        idProducto: producto.idProducto,
                        stock: productoEnStockDiario.stock + producto.cantidadVendida,
                        fechaActualizacion: encabezadoVenta.fechaVenta,
                        fechaValidez: obtenerSoloFecha(encabezadoVenta.fechaVenta)
                    }

                    await actualizarStockProductoDiarioDao(payloadRevertir);
                  }

                }catch(error){
                    throw error;
                }
            })
        );
        
    }catch(error){
        throw error;
    }   
}