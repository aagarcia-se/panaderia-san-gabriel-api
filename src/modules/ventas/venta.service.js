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
import { actualizarStockProductoDao, actualizarStockProductoDiarioDao, actualizarStockProductoDiariosBatchDao, actualizarStockProductosBatchDao, consultarStockProductoDao, consultarStockProductoDiarioDao, IngresarHistorialStockBatchDao, IngresarHistorialStockDao } from "../StockProductos/stockProductos.dao.js";
import { consultarStockProductoDiarioOptimizadoService, consultarStockProductosOptimizadoService, descontarStockPorVentasOptimizado } from "../StockProductos/stockProductos.service.js";
import { consultarDetalleVentaDao, consultarVentaporId, consultarVentasPorUsuarioDao, eliminarVentaDao, ingresarVentaDao, } from "./ventas.dao.js";
import { crearPayloadSobrante, procesarVentaService } from "./ventas.utils.js";

export const ingresarVentaService = async (venta) => {
  try {

    console.time("VENTA_TOTAL");

    console.time("procesarVenta");
    const ventaDetalleProcesado = await procesarVentaService(venta);
    
    if(ventaDetalleProcesado.detallesVenta.length === 0){
      throw new CustomError(getError(21));
    }
    console.timeEnd("procesarVenta");

    console.time("ingresarVentaDao");
    const resVenta = await ingresarVentaDao(ventaDetalleProcesado);
    console.timeEnd("ingresarVentaDao");

    if (resVenta === 0) {
      throw new CustomError(getError(2));
    }

    console.time("sobrantes");
    const paylodSobrante = crearPayloadSobrante(resVenta.idVenta, venta.detalleVenta);
    await ingresarSobranteService(paylodSobrante);
    console.timeEnd("sobrantes");

    console.time("descontarStock");
    await descontarStockPorVentasOptimizado(ventaDetalleProcesado);
    console.timeEnd("descontarStock");

    console.time("registrarIngreso");
    const detalleingreso = crearPayloadingresos(resVenta.idVenta, ventaDetalleProcesado);

    await registrarIngresoDiarioPorTurnoService(detalleingreso);
    console.timeEnd("registrarIngreso");

    if (
      venta.gastosDiarios &&
      venta.gastosDiarios.detalleGastosDiarios
    ) {
      console.time("gastos");
      await ingresarGastosDiariosService(resVenta.idVenta, venta.gastosDiarios);
      console.timeEnd("gastos");
    }

    if (venta.encabezadoVenta.idOrdenProduccion) {
      console.time("cerrarOrden");
      await actualizarEstadoOrdenProduccionServices(resVenta.encabezadoVenta.idOrdenProduccion);
      console.timeEnd("cerrarOrden");
    }

    console.timeEnd("VENTA_TOTAL");

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

export const eliminarVentaService = async (idVenta, dateTime) => {
  try {
    const [detalleVenta, ventaPorId] = await Promise.all([
      revertirVentaServices(idVenta, dateTime),   // ya devuelve el detalle
      consultarVentaporId(idVenta),
    ]);

    const resElminacion = await eliminarVentaDao(idVenta);
    if (resElminacion === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    const eliminacionTracking = {
      procesoEliminado: 'VENTA',
      idReferencia:     idVenta,
      idUsuario:        ventaPorId.idUsuario,
      idSucursal:       ventaPorId.idSucursal,
      turno:            ventaPorId.ventaTurno,
      fechaEliminacion: dateTime,
    };

    const detalleEliminacion = detalleVentaEliminadaPayload(detalleVenta);

    await Promise.all([
      registrarEliminacionPorDia(eliminacionTracking),
      registrarVentaEliminadaDao(detalleEliminacion),
    ]);

    return resElminacion;
  } catch (error) {
    throw error;
  }
};

export const revertirVentaServices = async (idVenta, dateTime) => {
    try {
        const detalleProductosVenta = await consultarDetalleVentaDao(idVenta);
        const { encabezadoVenta, detalleVenta } = detalleProductosVenta;

        await actuailizarEstadoOrdenProd(encabezadoVenta.fechaVenta, encabezadoVenta.ventaTurno);

        const idsProductos = detalleVenta.map(d => d.idProducto);

        const [stockProductos, stockProductosDiarios] = await Promise.all([
            consultarStockProductosOptimizadoService(idsProductos, encabezadoVenta.idSucursal),
            consultarStockProductoDiarioOptimizadoService(idsProductos, encabezadoVenta.idSucursal, obtenerSoloFecha(encabezadoVenta.fechaVenta))
        ]);

        const productosStockGeneral = detalleVenta.filter(d => d.controlarStock === 1 && d.controlarStockDiario === 0);
        const productosStockDiario  = detalleVenta.filter(d => !(d.controlarStock === 1 && d.controlarStockDiario === 0));

        const payloadsStockGeneral  = [];
        const payloadsStockDiario   = [];
        const payloadsHistorial     = [];

        // — Stock general
        productosStockGeneral.forEach((producto) => {
            const productoEnStock = stockProductos.getStock(producto.idProducto);
            const stockNuevo = productoEnStock.stock + producto.cantidadVendida;

            payloadsStockGeneral.push({
                idSucursal:          encabezadoVenta.idSucursal,
                idProducto:          producto.idProducto,
                stock:               stockNuevo,
                fechaActualizacion:  encabezadoVenta.fechaVenta,
            });

            payloadsHistorial.push({
                idUsuario:           encabezadoVenta.idUsuario,
                idProducto:          producto.idProducto,
                idSucursal:          encabezadoVenta.idSucursal,
                tipoMovimiento:      'INGRESO',
                stockAnterior:       productoEnStock.stock,
                cantidad:            producto.cantidadVendida,
                stockNuevo:          stockNuevo,
                fechaActualizacion:  dateTime,
                observaciones:       'Revertir venta por eliminacion',
                tipoReferencia:      'VENTA',
            });
        });

        // — Stock diario  (ahora también con historial, como pediste)
        productosStockDiario.forEach((producto) => {
            const productoEnStockDiario = stockProductosDiarios.getStockDiario(producto.idProducto);
            const stockNuevo = productoEnStockDiario.stock + producto.cantidadVendida;

            payloadsStockDiario.push({
                idSucursal:          encabezadoVenta.idSucursal,
                idProducto:          producto.idProducto,
                stock:               stockNuevo,
                fechaActualizacion:  encabezadoVenta.fechaVenta,
                fechaValidez:        obtenerSoloFecha(encabezadoVenta.fechaVenta),
            });

            payloadsHistorial.push({
                idUsuario:           encabezadoVenta.idUsuario,
                idProducto:          producto.idProducto,
                idSucursal:          encabezadoVenta.idSucursal,
                tipoMovimiento:      'INGRESO',
                stockAnterior:       productoEnStockDiario.stock,
                cantidad:            producto.cantidadVendida,
                stockNuevo:          stockNuevo,
                fechaActualizacion:  dateTime,
                observaciones:       'Revertir venta por eliminacion',
                tipoReferencia:      'VENTA',
            });
        });

        // — 3 batch en paralelo
        await Promise.all([
            payloadsStockGeneral.length > 0 ? actualizarStockProductosBatchDao(payloadsStockGeneral)      : Promise.resolve(),
            payloadsStockDiario.length  > 0 ? actualizarStockProductoDiariosBatchDao(payloadsStockDiario) : Promise.resolve(),
            payloadsHistorial.length    > 0 ? IngresarHistorialStockBatchDao(payloadsHistorial)            : Promise.resolve(),
        ]);

        return detalleProductosVenta;
    } catch (error) {
        throw error;
    }
};