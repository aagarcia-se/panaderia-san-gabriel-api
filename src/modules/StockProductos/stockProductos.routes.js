import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarStockDiarioPorSucursalController, consultarStockProductoController, consultarStockProductosController, corregirStockProductosController, registrarStockProductoController } from "./stockProductos.controller.js";

export const stockRoute = Router();

stockRoute.get("/consultar-stock-producto", authMiddleware, consultarStockProductoController);
stockRoute.get("/consultar-stock-productos/:idSucursal", authMiddleware, consultarStockProductosController);
stockRoute.get("/consultar-stock-sucursal", authMiddleware, consultarStockDiarioPorSucursalController);
stockRoute.post("/ingresar-stock-productos", authMiddleware, registrarStockProductoController);
stockRoute.put("/corregir-stock-productos", authMiddleware, corregirStockProductosController);