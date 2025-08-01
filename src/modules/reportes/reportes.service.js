import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { generarReporteDePerdidasDao, generarReporteHistorialStockDao, generarReporteVentasDao } from "./reportes.dao.js";


export const generarReporteHistorialStockServices = async (idProducto, idSucursal) => {
    try {
        const reporte = await generarReporteHistorialStockDao(idProducto, idSucursal);

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

        return reporte;
    } catch (error) {
        throw error;
    }
}
