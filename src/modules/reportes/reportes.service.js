import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { agruparPorProducto } from "./reoirtes.utils.js";
import { generarReporteBalanceStokDao, generarReporteDePerdidasDao, generarReporteHistorialStockDao, generarReporteSobrantesDao, generarReporteVentasDao, generarReporteVentasEliminadasDao } from "./reportes.dao.js";


export const generarReporteHistorialStockServices = async (idProducto, idSucursal, fechaInicio, fechaFin) => {
    try {
        const reporte = await generarReporteHistorialStockDao(idProducto, idSucursal, fechaInicio, fechaFin);

        if (reporte.length === 0) {
            throw new CustomError(getError(1));
        }

        return reporte;
    } catch (error) {
        throw error;
    }
}

export const generarReporteVentasServices = async (fechaInicio, fechaFin, idSucursal) => {
    try {
        const reporte = await generarReporteVentasDao(fechaInicio, fechaFin, idSucursal);

        if (reporte.length === 0) {
            throw new CustomError(getError(1));
        }

        return reporte;
    } catch (error) {
        throw error;
    }
}

export const generarReporteDePerdidasServices = async (fechaInicio, fechaFin, idSucursal) => {
    try {
        const reporte = await generarReporteDePerdidasDao(fechaInicio, fechaFin, idSucursal);

        if (reporte.length === 0) {
            throw new CustomError(getError(1));
        }

        // Agrupar los datos por producto
        const reporteAgrupado = agruparPorProducto(reporte);

        return reporteAgrupado;
    } catch (error) {
        throw error;
    }
}

export const generarReporteVentasEliminadasServices = async (fechaInicio, fechaFin, idSucursal) => {
    try {
        const reporte = await generarReporteVentasEliminadasDao(fechaInicio, fechaFin, idSucursal);
        if (reporte.length === 0) {
            throw new CustomError(getError(1));
        }

        return reporte;
    } catch (error) {
        throw error;
    }
}

export const generarReporteBalanceStockServices = async (fecha, idSucursal, turno) => {
    try {
        const reporte = await generarReporteBalanceStokDao(fecha, idSucursal, turno);
        if (reporte.length === 0) {
            throw new CustomError(getError(1));
        }

        return reporte;
    } catch (error) {
        throw error;
    }
}

export const generarReporteSobrantesServices = async (fecha, idSucursal) => {
    try {
        const reporte = await generarReporteSobrantesDao(fecha, idSucursal);
        if (reporte.length === 0) {
            throw new CustomError(getError(1));
        }

        return reporte;
    } catch (error) {
        throw error;
    }
}