import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarStockDiarioPorSucursalController, consultarStockGeneralController, consultarStockProductoController, consultarStockProductosController, corregirStockProductosController, registrarStockProductoController } from "./stockProductos.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const stockRoute = Router();

const stockPermission = requirePermission(PERMISSIONS.STOCK);

stockRoute.get("/consultar-stock-producto", authMiddleware, consultarStockProductoController);
stockRoute.get("/consultar-stock-productos/:idSucursal", authMiddleware, consultarStockProductosController);
stockRoute.get("/consultar-stock-sucursal", authMiddleware, consultarStockDiarioPorSucursalController);
stockRoute.post("/ingresar-stock-productos", authMiddleware, stockPermission, registrarStockProductoController);
stockRoute.put("/corregir-stock-productos", authMiddleware, stockPermission, corregirStockProductosController);
stockRoute.get("/consultar-stock-general", authMiddleware, consultarStockGeneralController);
