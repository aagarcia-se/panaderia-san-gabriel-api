import { cancelarDescuentoStockService, consultarDetalleDescuentosService, IngresarDescuentoServices } from "./descontarStock.service.js";
import { consultarDescuentoStockPorSucursalService } from "./descontarStock.service.js";

export const consultarDescuentoStockPorSucursalController = async (req, res, next) => {
  try{
    const descuentos = await consultarDescuentoStockPorSucursalService(req.params.idSucursal);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      descuentos,
    };
    res.status(200).json(responseData);
  }catch(error){
    next(error);
  }
}

export const descontarStockController = async (req, res, next) => {
    try {
      const stockADescontar = await IngresarDescuentoServices(req.body);
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        stockADescontar,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const cancelarDescuentoStockController = async (req, res, next) => {
    try {
      const gestionEliminada = await cancelarDescuentoStockService(req.params.idDescuento);
      const responseData = {
        status: 200,
        message: "Eliminacion exitosa",
        gestionEliminada,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const consultarDetalleDescuentosController = async (req, res, next) => {
    try {
      const descuentoStock = await consultarDetalleDescuentosService(req.params.idDescuento);
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        descuentoStock,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
};

export const cancelarDescuentoDeStockController = async (req, res, next) => {
    try {
      const gestionEliminada = await cancelarDescuentoStockService(req.params.idDescuento);
      const responseData = {
        status: 200,
        message: "Eliminacion exitosa",
        gestionEliminada,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
};