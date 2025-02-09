import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleOrdenProduccionController, eliminarOrdenProduccionController } from "./ordenesproduccion.controller.js";

export const ordenesRoutes = Router();

ordenesRoutes.get("/consultar-ordenes-produccion", authMiddleware, consultarDetalleOrdenProduccionController);
ordenesRoutes.delete("/eliminar-ordenes-produccion/:idOrdenProduccion", authMiddleware, eliminarOrdenProduccionController);


