import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { cancelarDescuentoDeStockController, consultarDetalleDescuentosController, descontarStockController } from "./descontarStock.controller.js";
import { consultarDescuentoStockPorSucursalController } from "./descontarStock.controller.js";

export const descontarStockRoute = Router();

descontarStockRoute.post("/descontar-stock", authMiddleware, descontarStockController);
descontarStockRoute.get("/consultar-descuento-stock-por-sucursal/:idSucursal", authMiddleware, consultarDescuentoStockPorSucursalController);
descontarStockRoute.get("/consultar-detalle-descuento/:idDescuento", authMiddleware, consultarDetalleDescuentosController);
descontarStockRoute.delete("/cancelar-descuento-stock/:idDescuento", authMiddleware, cancelarDescuentoDeStockController);
