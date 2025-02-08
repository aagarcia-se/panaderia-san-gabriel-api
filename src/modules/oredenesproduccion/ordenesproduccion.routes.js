import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleOrdenProduccionController } from "./ordenesproduccion.controller.js";

export const ordenesRoutes = Router();

ordenesRoutes.get("/consultar-ordenes-produccion", authMiddleware, consultarDetalleOrdenProduccionController);


