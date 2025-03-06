import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarIngresoDiarioPorTurnoService } from "../ingresos/ingresos.service.js";
import { crearPayloadingresos } from "../ingresos/ingresos.utils.js";
import { actualizarEstadoOrdenProduccionServices } from "../oredenesproduccion/ordenesproduccion.service.js";
import { consultarVentasPorUsuarioDao, ingresarVentaDao } from "./ventas.dao.js";
import { filtrarProductosPorCategoria, obtenerProductosPanaderiaVendidos, agregarPreciosAProductosVenta, calcularSubtotalVentaPorProductos, calcularVentaTotal, actualizarEncabezadoVenta, } from "./ventas.utils.js";

export const ingresarVentaService = async (venta) => {
    try {
        // Procesar detalles de la venta antes de ingresarla
        const ventaDetalleProcesado = await procesarVentaService(venta);

        // Guardar la venta en la base de datos
        const resVenta = await ingresarVentaDao(ventaDetalleProcesado);

        if (resVenta === 0) {
            throw new CustomError(getError(2));
        }

        const detalleingreso = crearPayloadingresos(resVenta.idVenta, ventaDetalleProcesado);

        await registrarIngresoDiarioPorTurnoService(detalleingreso)

        if(venta.encabezadoVenta.idOrdenProduccion){
            await actualizarEstadoOrdenProduccionServices(resVenta.encabezadoVenta.idOrdenProduccion);
        }

        return resVenta;
    } catch (error) {
        throw error;
    }
};

const procesarVentaService = async (venta) => {
    try {
        const { encabezadoVenta, detalleVenta, detalleIngreso } = venta;
        let productosPanaderiaReposteria;
        let productosNoPanaderia;
        let productosPanaderiaProcesados;
        let todosLosProductos;

        if(encabezadoVenta.idOrdenProduccion !== null){
            // 1. Filtrar productos de panadería o repostería (categorías 1 y 2)
            productosPanaderiaReposteria = filtrarProductosPorCategoria(detalleVenta, [1]);

            // 2. Filtrar productos que no son de panadería
            productosNoPanaderia = detalleVenta.filter(detalle => ![1].includes(detalle.idCategoria));

            // 3. Procesar productos de panadería o repostería (si existen)
            productosPanaderiaProcesados = productosPanaderiaReposteria.length > 0
            ? await obtenerProductosPanaderiaVendidos(encabezadoVenta.idOrdenProduccion, productosPanaderiaReposteria)
            : [];

            // 4. Combinar productos procesados y no procesados
            todosLosProductos = [
                ...productosPanaderiaProcesados, // Productos de panadería procesados
                ...productosNoPanaderia, // Productos que no son de panadería
            ];

        }

        if(encabezadoVenta.idOrdenProduccion === null){
            todosLosProductos = detalleVenta;
        }

        // 5. Agregar precios unitarios a todos los productos
        const productosConPrecios = await agregarPreciosAProductosVenta(todosLosProductos);

        // 6. Calcular subtotales por producto
        const detallesConSubtotal = calcularSubtotalVentaPorProductos(productosConPrecios);

        // 7. Calcular el total de la venta
        const ventaTotal = calcularVentaTotal(detallesConSubtotal);

        // 8. Actualizar el encabezado de la venta con el total
        const encabezadoActualizado = {
            ...encabezadoVenta,
            totalVenta: ventaTotal,
        };

        // 9. Retornar la venta procesada
        const ventaProcesada = {
            encabezadoVenta: encabezadoActualizado,
            detallesVenta: detallesConSubtotal,
            detalleIngreso: detalleIngreso, // Agregar detalleIngreso a ventaProcesada
        };

        return ventaProcesada;
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
