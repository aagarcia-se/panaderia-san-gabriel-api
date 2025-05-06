import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleDescuentosController, descontarStockController } from "./descontarStock.controller.js";
import { cancelarDescuentoStockController, consultarDescuentoStockPorSucursalController } from "./descontarStock.controller.js";

export const descontarStockRoute = Router();

descontarStockRoute.post("/descontar-stock", authMiddleware, descontarStockController);
descontarStockRoute.get("/consultar-descuento-stock-por-sucursal/:idSucursal", authMiddleware, consultarDescuentoStockPorSucursalController);
descontarStockRoute.delete("/cancelar-descuento-stock/:idDescuento", authMiddleware, cancelarDescuentoStockController);
descontarStockRoute.get("/consultar-detalle-descuento/:idDescuento", authMiddleware, consultarDetalleDescuentosController);
