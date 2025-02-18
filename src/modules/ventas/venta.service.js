import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { ingresarVentaDao } from "./ventas.dao.js";
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

        return resVenta;
    } catch (error) {
        throw error;
    }
};

const procesarVentaService = async (venta) => {
    try {
        const { encabezadoVenta, detalleVenta } = venta;

        // 1. Filtrar productos de panadería o repostería
        const productosPanaderiaReposteria = filtrarProductosPorCategoria(detalleVenta, [1, 2]);

        // 2. Procesar productos de panadería o repostería (si existen)
        const productosProcesados = productosPanaderiaReposteria.length > 0
            ? await obtenerProductosPanaderiaVendidos(productosPanaderiaReposteria)
            : detalleVenta;

        // 3. Agregar precios unitarios a los productos
        const productosConPrecios = await agregarPreciosAProductosVenta(productosProcesados);

        // 4. Calcular subtotales por producto
        const detallesConSubtotal = calcularSubtotalVentaPorProductos(productosConPrecios);

        // 5. Calcular el total de la venta
        const ventaTotal = calcularVentaTotal(detallesConSubtotal);

        // 6. Actualizar el encabezado de la venta con el total
        const encabezadoActualizado = actualizarEncabezadoVenta(encabezadoVenta, ventaTotal);

        // 7. Retornar la venta procesada
        const ventaProcesada = {
            encabezadoVenta: encabezadoActualizado,
            detallesVenta: detallesConSubtotal,
        };
        return ventaProcesada;
    } catch (error) {
        throw error;
    }
};





