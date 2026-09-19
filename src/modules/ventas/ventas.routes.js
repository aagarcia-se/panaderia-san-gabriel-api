import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleVentaController, consultarVentasPorSucursalController, consultarVentasPorUsuarioController, elminarVentaController, ingresarVentaController } from "./ventas.controller.js";

export const ventasRoutes = Router();

ventasRoutes.post("/ingresar-venta", authMiddleware, ingresarVentaController);
ventasRoutes.get("/consultar-venta-por-usuario", authMiddleware, consultarVentasPorUsuarioController);
ventasRoutes.delete("/eliminar-venta", authMiddleware, elminarVentaController);
ventasRoutes.get("/consultar-detalle-venta/:idVenta", authMiddleware, consultarDetalleVentaController);
ventasRoutes.get("/consultar-venta-por-sucursal/:idSucursal", authMiddleware, consultarVentasPorSucursalController);