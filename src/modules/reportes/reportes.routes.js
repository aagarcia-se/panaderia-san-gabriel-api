import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarGastosPorFechaYSucursalController, consultarVentaPorProductoController, generarReporteBalanceStockController, generarReporteDePerdidasController, generarReporteHistorialStockController, generarReporteSobrantesController, generarReporteVentasEliminadasController } from "./reportes.controller.js";
import { generarReporteVentasController } from "./reportes.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const reportesRoute = Router();

const reportsPermission = requirePermission(PERMISSIONS.REPORTS);

reportesRoute.get("/generar-reporte-historial-stock", authMiddleware, reportsPermission, generarReporteHistorialStockController);
reportesRoute.get("/generar-reporte-ventas", authMiddleware, reportsPermission, generarReporteVentasController);
reportesRoute.get("/generar-reporte-perdidas", authMiddleware, reportsPermission, generarReporteDePerdidasController);
reportesRoute.get("/generar-reporte-ventas-eliminadas", authMiddleware, reportsPermission, generarReporteVentasEliminadasController);
reportesRoute.get("/generar-reporte-balance-stock", authMiddleware, reportsPermission, generarReporteBalanceStockController);
reportesRoute.get("/generar-reporte-sobrantes", authMiddleware, reportsPermission, generarReporteSobrantesController);
reportesRoute.get("/gastos-por-fecha-y-sucursal", authMiddleware, reportsPermission, consultarGastosPorFechaYSucursalController);
reportesRoute.get("/venta-por-producto", authMiddleware, reportsPermission, consultarVentaPorProductoController);
