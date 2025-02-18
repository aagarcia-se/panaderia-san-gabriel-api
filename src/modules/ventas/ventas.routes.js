import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { ingresarVentaController } from "./ventas.controller.js";

export const ventasRoutes = Router();

ventasRoutes.post("/ingresar-venta", authMiddleware, ingresarVentaController);

