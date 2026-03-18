import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarGastosPorFechaYSucursalController, consultarVentaPorProductoController, generarReporteBalanceStockController, generarReporteDePerdidasController, generarReporteHistorialStockController, generarReporteSobrantesController, generarReporteVentasEliminadasController } from "./reportes.controller.js";
import { generarReporteVentasController } from "./reportes.controller.js";

export const reportesRoute = Router();    

reportesRoute.get("/generar-reporte-historial-stock", authMiddleware, generarReporteHistorialStockController);
reportesRoute.get("/generar-reporte-ventas", authMiddleware, generarReporteVentasController);
reportesRoute.get("/generar-reporte-perdidas", authMiddleware, generarReporteDePerdidasController);
reportesRoute.get("/generar-reporte-ventas-eliminadas", authMiddleware, generarReporteVentasEliminadasController);
reportesRoute.get("/generar-reporte-balance-stock", authMiddleware, generarReporteBalanceStockController);
reportesRoute.get("/generar-reporte-sobrantes", authMiddleware, generarReporteSobrantesController);
reportesRoute.get("/gastos-por-fecha-y-sucursal", authMiddleware, consultarGastosPorFechaYSucursalController);
reportesRoute.get("/venta-por-producto", authMiddleware, consultarVentaPorProductoController);

