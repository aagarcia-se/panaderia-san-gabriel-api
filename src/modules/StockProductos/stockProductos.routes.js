import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarStockProductoController, consultarStockProductosController, corregirStockProductosController, registrarStockProductoController } from "./stockProductos.controller.js";

export const stockRoute = Router();

stockRoute.get("/consultar-stock-producto/:idProducto", authMiddleware, consultarStockProductoController);
stockRoute.get("/consultar-stock-productos", authMiddleware, consultarStockProductosController);
stockRoute.post("/ingresar-stock-productos", authMiddleware, registrarStockProductoController);
stockRoute.put("/corregir-stock-productos", authMiddleware, corregirStockProductosController);