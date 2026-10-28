import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleOrdenPorCriteriosController, consultarDetalleOrdenProduccionController, consultarOrdenProduccionController, eliminarOrdenProduccionController, ingresarOrdenProduccionController } from "./ordenesproduccion.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const ordenesRoutes = Router();

const productionPermission = requirePermission(PERMISSIONS.PRODUCTION);

ordenesRoutes.get("/consultar-ordenes-produccion", authMiddleware, consultarOrdenProduccionController);
ordenesRoutes.get("/consultar-detalle-ordenes-produccion/:idOrdenProduccion", authMiddleware, consultarDetalleOrdenProduccionController);
ordenesRoutes.delete("/eliminar-ordenes-produccion/:idOrdenProduccion", authMiddleware, productionPermission, eliminarOrdenProduccionController);
ordenesRoutes.post("/ingresar-orden", authMiddleware, productionPermission, ingresarOrdenProduccionController);
ordenesRoutes.get("/consultar-detalle-por-criterios", authMiddleware, consultarDetalleOrdenPorCriteriosController);
