import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarDescuentoporProductosDao } from "../descontarStock/descontarStock.dao.js";
import { consultarUnidadesDeProductoPorOrdenService, consultarUnidadesDeProductosPorOrdenOptimizadoService } from "../oredenesproduccion/ordenesproduccion.service.js";
import { consultarPrecioProductoPorIdOptimizadoService, consultarPrecioProductoPorIdService } from "../precios/precios.service.js";
import { consultarStockProductoDao, consultarStockProductoDiarioDao } from "../StockProductos/stockProductos.dao.js";
import { consultarStockProductoDiarioOptimizadoService, consultarStockProductosOptimizadoService } from "../StockProductos/stockProductos.service.js";
    
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
export const obtenerProductosPanaderiaVendidos = async (encabezadoVenta, ventaDetalle, idSucursal) => {
    try {
        const idsProductos = ventaDetalle.map(d => d.idProducto);

        // ✅ 1 sola query para todos los descuentos (antes era 1 por producto)
        const descuentos = await consultarDescuentoporProductosDao(idsProductos, idSucursal, encabezadoVenta.fechaVenta);

        const detallesEnOrden = await Promise.all(
            ventaDetalle.map(async (detalle) => {

                if (detalle.tipoProduccion === "bandejas" && encabezadoVenta.ventaTurno === "AM") {

                    // ✅ Busca en el mapa en memoria — sin query HTTP
                    const productoDescontado = descuentos.getDescuento(detalle.idProducto);

                    // Esta sigue igual por ahora hasta optimizarla
                    const productoProducido = await consultarUnidadesDeProductoPorOrdenService(
                        encabezadoVenta.idOrdenProduccion, 
                        detalle.idProducto
                    );

                    if (productoDescontado.idDescuento !== 0 && productoProducido.detalleOrden.idDetalleOrdenProduccion !== 0) {
                        const cantidadRestante = productoProducido.detalleOrden.cantidadUnidades - productoDescontado.unidadesDescontadas;
                        if (cantidadRestante > 0) {
                            const cantidadVendida = calcularUnidadesDePanaderiaVendidas(cantidadRestante, detalle.unidadesNoVendidas);
                            return {
                                ...detalle,
                                cantidadProducida: productoProducido.detalleOrden.cantidadUnidades,
                                cantidadVendida,
                            };
                        }

                    } else if (productoDescontado.idDescuento === 0 && productoProducido.detalleOrden.idDetalleOrdenProduccion !== 0) {
                        const cantidadVendida = calcularUnidadesDePanaderiaVendidas(productoProducido.detalleOrden.cantidadUnidades, detalle.unidadesNoVendidas);
                        if (cantidadVendida > 0) {
                            return {
                                ...detalle,
                                cantidadProducida: productoProducido.detalleOrden.cantidadUnidades,
                                cantidadVendida,
                            };
                        }
                    }

                } else {

                    if (detalle.controlarStock === 1 && detalle.controlarStockDiario === 0) {
                        const productoEnStock = await consultarStockProductoDao(detalle.idProducto, idSucursal);
                        if (productoEnStock.idStock !== 0 && productoEnStock.stock > 0) {
                            const cantidadVendida = calcularUnidadesDePanaderiaVendidas(productoEnStock.stock, detalle.unidadesNoVendidas);
                            if (cantidadVendida > 0) {
                                return { ...detalle, cantidadVendida };
                            }
                        }
                    } else {
                        const productoEnStockDiario = await consultarStockProductoDiarioDao(detalle.idProducto, idSucursal, detalle.fechaCreacion);
                        if (productoEnStockDiario.idStockDiario !== 0 && productoEnStockDiario.stock > 0) {
                            const cantidadVendida = calcularUnidadesDePanaderiaVendidas(productoEnStockDiario.stock, detalle.unidadesNoVendidas);
                            if (cantidadVendida > 0) {
                                return { ...detalle, cantidadVendida };
                            }
                        }
                    }
                }

                return null;
            })
        );

        return detallesEnOrden.filter((detalle) => detalle !== null);
    } catch (error) {
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
        const { encabezadoVenta, detalleVenta, detalleIngreso, gastosDiarios } = venta;
        let productosProcesados;     
        let idSucursal = encabezadoVenta.idSucursal;

       // if(encabezadoVenta.idOrdenProduccion !== null){
            // 1. Procesar productos de panadería o repostería (si existen)
            productosProcesados = await obtenerProductosPanaderiaVendidosOptimizado(encabezadoVenta, detalleVenta, idSucursal);
        //}

        //2. Agregar precios unitarios a todos los productos
        const productosConPrecios = await agregarPreciosAProductosVentaOptimizado(productosProcesados);

        // 3. Calcular subtotales por producto
       const detallesConSubtotal = calcularSubtotalVentaPorProductos(productosConPrecios);

        // 4. Calcular el total de la venta
        const ventaTotal = calcularVentaTotal(detallesConSubtotal);

        // 5. Actualizar el encabezado de la venta con el total
        const encabezadoActualizado = {
            ...encabezadoVenta,
            totalVenta: ventaTotal,
        };

        // 6. Retornar la venta procesada
        const ventaProcesada = {
            encabezadoVenta: encabezadoActualizado,
            detallesVenta: detallesConSubtotal,
            detalleIngreso: detalleIngreso, // Agregar detalleIngreso a ventaProcesada
            gastosDiarios: gastosDiarios
        };

        return ventaProcesada;
    } catch (error) {
        throw error;
    }
};

export const crearPayloadSobrante = (idVenta, detalleVenta) => {

    const payloadSobrante = detalleVenta.map((detalle) => {
        const payload = {
            idVenta: idVenta,
            idProducto: detalle.idProducto,
            unidadesSobrantes: detalle.unidadesNoVendidas,
        }

        return payload;
    });

    return payloadSobrante;
}


//Funciones
// ------------------------------------------------------------------------------
// ------------------------------------------------------------------------------

/**
 * Obtiene los productos de panadería vendidos.
 * @param {Array} ventaDetalle - Detalle de la venta.
 * @returns {Promise<Array>} - Detalle de la venta con las unidades vendidas calculadas.
 */
export const obtenerProductosPanaderiaVendidosOptimizado = async (encabezadoVenta, ventaDetalle, idSucursal) => {
    try {
        const idsProductos = ventaDetalle.map(d => d.idProducto);

        // ✅ 4 queries en paralelo antes del loop — antes eran N*4 queries
        const [descuentos, detallesOrden, stockProductos, stockProductosDiarios] = await Promise.all([
            consultarDescuentoporProductosDao(idsProductos, idSucursal, encabezadoVenta.fechaVenta),
            consultarUnidadesDeProductosPorOrdenOptimizadoService(encabezadoVenta.idOrdenProduccion, idsProductos),
            consultarStockProductosOptimizadoService(idsProductos, idSucursal),
            consultarStockProductoDiarioOptimizadoService(idsProductos, idSucursal, encabezadoVenta.fechaVenta)
        ]);

        // ✅ Sin async/await — todo es búsqueda en memoria
        const detallesEnOrden = ventaDetalle.map((detalle) => {

            if (detalle.tipoProduccion === "bandejas" && encabezadoVenta.ventaTurno === "AM") {

                const productoDescontado = descuentos.getDescuento(detalle.idProducto);
                const detalleOrden = detallesOrden.getDetalleOrden(detalle.idProducto);

                if (productoDescontado.idDescuento !== 0 && detalleOrden.idDetalleOrdenProduccion !== 0) {
                    const cantidadRestante = detalleOrden.cantidadUnidades - productoDescontado.unidadesDescontadas;
                    if (cantidadRestante > 0) {
                        const cantidadVendida = calcularUnidadesDePanaderiaVendidas(cantidadRestante, detalle.unidadesNoVendidas);
                        return {
                            ...detalle,
                            cantidadProducida: detalleOrden.cantidadUnidades,
                            cantidadVendida,
                        };
                    }

                } else if (productoDescontado.idDescuento === 0 && detalleOrden.idDetalleOrdenProduccion !== 0) {
                    const cantidadVendida = calcularUnidadesDePanaderiaVendidas(detalleOrden.cantidadUnidades, detalle.unidadesNoVendidas);
                    if (cantidadVendida > 0) {
                        return {
                            ...detalle,
                            cantidadProducida: detalleOrden.cantidadUnidades,
                            cantidadVendida,
                        };
                    }
                }

            } else {

                if (detalle.controlarStock === 1 && detalle.controlarStockDiario === 0) {
                    const productoEnStock = stockProductos.getStock(detalle.idProducto);
                    if (productoEnStock.idStock !== 0 && productoEnStock.stock > 0) {
                        const cantidadVendida = calcularUnidadesDePanaderiaVendidas(productoEnStock.stock, detalle.unidadesNoVendidas);
                        if (cantidadVendida > 0) {
                            return { ...detalle, cantidadVendida };
                        }
                    }
                } else {
                    const productoEnStockDiario = stockProductosDiarios.getStockDiario(detalle.idProducto);
                    if (productoEnStockDiario.idStockDiario !== 0 && productoEnStockDiario.stock > 0) {
                        const cantidadVendida = calcularUnidadesDePanaderiaVendidas(productoEnStockDiario.stock, detalle.unidadesNoVendidas);
                        if (cantidadVendida > 0) {
                            return { ...detalle, cantidadVendida };
                        }
                    }
                }
            }

            return null;
        });

        return detallesEnOrden.filter((detalle) => detalle !== null);
    } catch (error) {
        throw error;
    }
};


export const agregarPreciosAProductosVentaOptimizado = async (ventaDetalle) => {
    const idsProductos = ventaDetalle.map(d => d.idProducto);
    const precios = await consultarPrecioProductoPorIdOptimizadoService(idsProductos); // 1 sola query

    return ventaDetalle.map(detalle => ({  // sin async
        ...detalle,
        precioUnitario: precios.getPrecio(detalle.idProducto).precioPorUnidad,
    }));
};