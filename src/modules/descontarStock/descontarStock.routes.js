import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { cancelarDescuentoDeStockController, consultarDetalleDescuentosController, descontarStockController } from "./descontarStock.controller.js";
import { consultarDescuentoStockPorSucursalController } from "./descontarStock.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const descontarStockRoute = Router();

const stockPermission = requirePermission(PERMISSIONS.STOCK);

descontarStockRoute.post("/descontar-stock", authMiddleware, stockPermission, descontarStockController);
descontarStockRoute.get("/consultar-descuento-stock-por-sucursal/:idSucursal", authMiddleware, consultarDescuentoStockPorSucursalController);
descontarStockRoute.get("/consultar-detalle-descuento/:idDescuento", authMiddleware, consultarDetalleDescuentosController);
descontarStockRoute.delete("/cancelar-descuento-stock/:idDescuento", authMiddleware, stockPermission, cancelarDescuentoDeStockController);
