import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { descontarStockController } from "./descontarStock.controller.js";
import { consultarDescuentoStockPorSucursalController } from "./descontarStock.controller.js";

export const descontarStockRoute = Router();

descontarStockRoute.post("/descontar-stock", authMiddleware, descontarStockController);
descontarStockRoute.get("/consultar-descuento-stock-por-sucursal/:idSucursal", authMiddleware, consultarDescuentoStockPorSucursalController);
