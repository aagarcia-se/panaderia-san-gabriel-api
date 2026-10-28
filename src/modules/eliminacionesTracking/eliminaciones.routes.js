import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarEliminacionPorDiaController } from "./eliminacionesdiarias.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const eliminacionesRoute = Router();

eliminacionesRoute.get("/consultar-eliminacion-por-dia", authMiddleware, requirePermission(PERMISSIONS.REPORTS), consultarEliminacionPorDiaController);
