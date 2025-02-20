import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleOrdenPorCriteriosController, consultarDetalleOrdenProduccionController, consultarOrdenProduccionController, eliminarOrdenProduccionController, ingresarOrdenProduccionController } from "./ordenesproduccion.controller.js";

export const ordenesRoutes = Router();

ordenesRoutes.get("/consultar-ordenes-produccion", authMiddleware, consultarOrdenProduccionController);
ordenesRoutes.get("/consultar-detalle-ordenes-produccion/:idOrdenProduccion", authMiddleware, consultarDetalleOrdenProduccionController);
ordenesRoutes.delete("/eliminar-ordenes-produccion/:idOrdenProduccion", authMiddleware, eliminarOrdenProduccionController);
ordenesRoutes.post("/ingresar-orden", authMiddleware, ingresarOrdenProduccionController);
ordenesRoutes.get("/consultar-detalle-por-criterios", authMiddleware, consultarDetalleOrdenPorCriteriosController);


