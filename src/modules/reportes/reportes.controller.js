import { generarReporteDePerdidasServices, generarReporteHistorialStockServices, generarReporteVentasServices } from "./reportes.service.js";


export const generarReporteHistorialStockController = async (req, res, next) => {
    try {

        const {idProducto, idSucursal, fechaInicio, fechaFin} = req.query;
        const reporte   = await generarReporteHistorialStockServices(idProducto, idSucursal, fechaInicio, fechaFin);
        const responseData = {
          status: 200,
          message: "Consulta exitosa",
          reporte,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const generarReporteVentasController = async (req, res, next) => {
    try {

        const {fechaInicio, fechaFin, idSucursal} = req.query;
        const reporte   = await generarReporteVentasServices(fechaInicio, fechaFin, idSucursal);
        const responseData = {
          status: 200,
          message: "Consulta exitosa",
          reporte,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const generarReporteDePerdidasController = async (req, res, next) => {
    try {

        const {fechaInicio, fechaFin, idSucursal} = req.query;
        const reporte   = await generarReporteDePerdidasServices(fechaInicio, fechaFin, idSucursal);
        const responseData = {
          status: 200,
          message: "Consulta exitosa",
          reporte,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}
