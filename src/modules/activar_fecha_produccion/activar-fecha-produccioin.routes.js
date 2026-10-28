import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarFechasProduccionController, ingresarFechaProduccionController } from "./activar-fecha-produccion.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const activarFechaProduccionRoute = Router();

const productionDatePermission = requirePermission(PERMISSIONS.PRODUCTION_DATE);

activarFechaProduccionRoute.get("/fecha-produccion", authMiddleware, productionDatePermission, consultarFechasProduccionController);
activarFechaProduccionRoute.post("/activar-fecha-produccion", authMiddleware, productionDatePermission, ingresarFechaProduccionController);
