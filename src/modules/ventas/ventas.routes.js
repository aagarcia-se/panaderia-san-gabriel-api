import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleVentaController, consultarVentasPorSucursalController, consultarVentasPorUsuarioController, elminarVentaController, ingresarVentaController } from "./ventas.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const ventasRoutes = Router();

const salesPermission = requirePermission(PERMISSIONS.SALES);

ventasRoutes.post("/ingresar-venta", authMiddleware, salesPermission, ingresarVentaController);
ventasRoutes.get("/consultar-venta-por-usuario", authMiddleware, consultarVentasPorUsuarioController);
ventasRoutes.delete("/eliminar-venta", authMiddleware, salesPermission, elminarVentaController);
ventasRoutes.get("/consultar-detalle-venta/:idVenta", authMiddleware, consultarDetalleVentaController);
ventasRoutes.get("/consultar-venta-por-sucursal/:idSucursal", authMiddleware, consultarVentasPorSucursalController);
