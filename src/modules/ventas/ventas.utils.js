import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarUnidadesDeProductoPorOrdenService } from "../oredenesproduccion/ordenesproduccion.service.js";
import { consultarPrecioProductoPorIdService } from "../precios/precios.service.js";

/**
 * Filtra los productos por categoría.
 * @param {Array} detalleVenta - Detalle de la venta.
 * @param {Array} categorias - IDs de las categorías a filtrar.
 * @returns {Array} - Productos que pertenecen a las categorías especificadas.
 */
export const filtrarProductosPorCategoria = (detalleVenta, categorias) => {
    return detalleVenta.filter(detalle => categorias.includes(detalle.idCategoria));
};

/**
 * Calcula las unidades vendidas de productos de panadería.
 * @param {number} unidadesProducidas - Unidades producidas.
 * @param {number} unidadesNoVendidas - Unidades no vendidas.
 * @returns {number} - Unidades vendidas.
 * @throws {CustomError} - Si las unidades no vendidas son mayores que las producidas.
 */
const calcularUnidadesDePanaderiaVendidas = (unidadesProducidas, unidadesNoVendidas) => {
    try {
        if (unidadesNoVendidas > unidadesProducidas) {
            const error = getError(18);
            throw new CustomError(error);
        }
        return unidadesProducidas - unidadesNoVendidas;
    } catch (error) {
        throw error;
    }
};

/**
 * Calcula el subtotal de un producto.
 * @param {number} unidadesVendidas - Cantidad de unidades vendidas.
 * @param {number} precioUnidad - Precio unitario del producto.
 * @returns {number} - Subtotal redondeado a 2 decimales.
 */
const calcularSubtotalVenta = (unidadesVendidas, precioUnidad) => {
    const subtotal = unidadesVendidas * precioUnidad; // Calcula el subtotal sin redondear
    return Math.round(subtotal * 100) / 100; // Redondea a 2 decimales
};

/**
 * Obtiene los productos de panadería vendidos.
 * @param {Array} ventaDetalle - Detalle de la venta.
 * @returns {Promise<Array>} - Detalle de la venta con las unidades vendidas calculadas.
 */
export const obtenerProductosPanaderiaVendidos = async (idOrdenProduccion, ventaDetalle) => {
    try {
        // Filtrar y procesar solo los detalles que están en la orden
        const detallesEnOrden = await Promise.all(
            ventaDetalle.map(async (detalle) => {
                // Consultar unidades producidas
                const productoProducido = await consultarUnidadesDeProductoPorOrdenService(idOrdenProduccion, detalle.idProducto);

                // Si el producto está en la orden, calcular la cantidad vendida
                if (productoProducido.detalleOrden.idDetalleOrdenProduccion !== 0) {
                    const cantidadVendida = calcularUnidadesDePanaderiaVendidas(productoProducido.detalleOrden.cantidadUnidades, detalle.unidadesNoVendidas);

                    // Retornar el detalle con la información adicional
                    return {
                        ...detalle,
                        cantidadProducida: productoProducido.detalleOrden.cantidadUnidades,
                        cantidadVendida: cantidadVendida,
                    };
                }

                // Si no está en la orden, no retornar nada (será filtrado)
                return null;
            })
        );

        // Filtrar los detalles nulos (productos que no están en la orden)
        return detallesEnOrden.filter((detalle) => detalle !== null);
    } catch (error) {
        // Manejar errores
        throw error;
    }
};

/**
 * Agrega los precios unitarios a los productos en el detalle de la venta.
 * @param {Array} ventaDetalle - Detalle de la venta.
 * @returns {Promise<Array>} - Detalle de la venta con los precios unitarios agregados.
 */
export const agregarPreciosAProductosVenta = (ventaDetalle) => {
    return Promise.all(
        ventaDetalle.map(async (detalle) => {
            const producto = await consultarPrecioProductoPorIdService(detalle.idProducto);
            return {
                ...detalle,
                precioUnitario: producto.precioPorUnidad,
            };
        })
    );
};

/**
 * Calcula el subtotal para cada producto en el detalle de la venta.
 * @param {Array} detalleVenta - Detalle de la venta.
 * @returns {Array} - Detalle de la venta con los subtotales calculados.
 */
export const calcularSubtotalVentaPorProductos = (detalleVenta) => {
    const detallesConSubtotal = detalleVenta.map((detalle) => {
        return {
            ...detalle,
            subtotal: calcularSubtotalVenta(detalle.cantidadVendida, detalle.precioUnitario),
        };
    });
    return detallesConSubtotal;
};

/**
 * Calcula el total de la venta sumando todos los subtotales.
 * @param {Array} detalleVenta - Detalle de la venta con subtotales calculados.
 * @returns {number} - Total de la venta.
 */
export const calcularVentaTotal = (detalleVenta) => {
    const totalVenta = detalleVenta.reduce((total, detalle) => total + detalle.subtotal, 0);
    return totalVenta;
};

/**
 * Actualiza el encabezado de la venta con el total calculado.
 * @param {Array} encabezadoVenta - Encabezado de la venta.
 * @param {number} ventaTotal - Total de la venta.
 * @returns {Array} - Encabezado de la venta actualizado.
 */
export const actualizarEncabezadoVenta = (encabezadoVenta, totalVenta) => {
    // Si encabezadoVenta tiene una clave numérica (como '0'), extrae su valor
    if (encabezadoVenta && typeof encabezadoVenta === 'object' && !Array.isArray(encabezadoVenta)) {
        const encabezado = encabezadoVenta['0'] || encabezadoVenta; // Extrae el objeto dentro de '0' o usa el objeto directamente
        return {
            ...encabezado, // Copia todas las propiedades del encabezado
            totalVenta, // Agrega el total de la venta
        };
    }

    // Si encabezadoVenta ya es un objeto plano, simplemente agrega ventaTotal
    return {
        ...encabezadoVenta,
        totalVenta,
    };
};

export const procesarVentaService = async (venta) => {
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