import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { generarReporteHistorialStockController } from "./reportes.controller.js";
import { generarReporteVentasController } from "./reportes.controller.js";

export const reportesRoute = Router();    

reportesRoute.get("/generar-reporte-historial-stock", authMiddleware, generarReporteHistorialStockController);
reportesRoute.get("/generar-reporte-ventas", authMiddleware, generarReporteVentasController);