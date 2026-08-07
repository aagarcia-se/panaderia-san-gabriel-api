import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { descontarStockServicesOptimizado } from "../descontarStock/descontarStock.service.js";
import { consultarDetalleDeTraladoDao, consultarTrasladosDao, eliminarTrasladoDao, registrarTrasladoProductoDao } from "./traslados.dao.js";
import { normalizarObjetoDescuentoProductoOrigenTraslado, normalizarObjetoAgregarProductoDestinoTraslado } from "./traslados.utils.js";
import { registrarStockProductosOptimizadoService } from "../StockProductos/stockProductos.service.js";

/*--------------------------------------------------------------------
----------------- Gestion de la tabla Traslados Productos ------------
----------------------------------------------------------------------*/
export const registrarTrasladoProductoService = async (trasladoProducto) => {
    try {
        const stockADescontarData = normalizarObjetoDescuentoProductoOrigenTraslado(trasladoProducto);
        const stockAAgregarData = normalizarObjetoAgregarProductoDestinoTraslado(trasladoProducto);

        // Descontar origen y agregar destino en paralelo
        await Promise.all([
            descontarStockServicesOptimizado(stockADescontarData),
            registrarStockProductosOptimizadoService(stockAAgregarData),
        ]);

        const resTraslado = await registrarTrasladoProductoDao(trasladoProducto);

        if (resTraslado === 0) {
            throw new CustomError(getError(2));
        }

        return resTraslado;
    } catch (error) {
        throw error;
    }
};

export const consultarTrasladosService = async () => {
    try {
        const resTraslados = await consultarTrasladosDao();

        if (resTraslados.length === 0) {
            throw new CustomError(getError(1));
        }

        return resTraslados;
    } catch (error) {
        throw error;
    }
}

export const consultarDetalleDeTraladoService = async (idTraslado) => {
    try {
        const resTraslados = await consultarDetalleDeTraladoDao(idTraslado);

        if (resTraslados === 0) {
            throw new CustomError(getError(1));
        }

        return resTraslados;
    } catch (error) {
        throw error;
    }
}

export const eliminarTrasladoService = async (idTraslado) => {
    try {
        const trasladoProducto = await consultarDetalleDeTraladoService(idTraslado);
        const { encabezadoTraslado, detalle } = trasladoProducto;

        // Normalizar para descontar del DESTINO
        const stockADescontarData = {
            descuentoInfo: {
                idSucursal:    encabezadoTraslado.idSucursalDestino, // 👈 destino
                idUsuario:     encabezadoTraslado.idUsuario,
                fechaDescuento: encabezadoTraslado.fechaTraslado,
                fechaCreacion: encabezadoTraslado.fechaTraslado,
            },
            detalleDescuento: detalle.map(d => ({
                idProducto:           d.idProducto,
                controlarStock:       d.controlarStock,
                controlarStockDiario: d.controlarStockDiario,
                stockADescontar:      d.cantidadATrasladar,
                fechaDescuento:       encabezadoTraslado.fechaTraslado,
                fechaCreacion:        encabezadoTraslado.fechaTraslado,
            }))
        };

        // Normalizar para agregar al ORIGEN
        const stockAAgregarData = {
            stockProductos: detalle.map(d => ({
                idUsuario:            encabezadoTraslado.idUsuario,
                idProducto:           d.idProducto,
                idSucursal:           encabezadoTraslado.idSucursalOrigen, // 👈 origen
                stock:                d.cantidadATrasladar,
                controlarStock:       d.controlarStock,
                controlarStockDiario: d.controlarStockDiario,
                fechaActualizacion:   encabezadoTraslado.fechaTraslado,
                fechaCreacion:        encabezadoTraslado.fechaTraslado,
                fechaValidez:         encabezadoTraslado.fechaTraslado,
            }))
        };

        // Revertir en paralelo + eliminar secuencial al final
        await Promise.all([
            descontarStockServicesOptimizado(stockADescontarData),
            registrarStockProductosOptimizadoService(stockAAgregarData),
        ]);

        const resTraslado = await eliminarTrasladoDao(idTraslado);

        if (resTraslado === 0) {
            throw new CustomError(getError(4));
        }

        return resTraslado;
    } catch (error) {
        throw error;
    }
};