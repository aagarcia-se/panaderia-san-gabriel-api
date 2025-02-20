import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarVentasPorUsuarioController, ingresarVentaController } from "./ventas.controller.js";

export const ventasRoutes = Router();

ventasRoutes.post("/ingresar-venta", authMiddleware, ingresarVentaController);
ventasRoutes.get("/consultar-venta-por-usuario", authMiddleware, consultarVentasPorUsuarioController);

