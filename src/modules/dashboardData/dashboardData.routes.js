import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDataDashboardController } from "./dashboardData.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const dashboardDataRoute = Router();

dashboardDataRoute.get("/consultar-data-dashboard", authMiddleware, requirePermission(PERMISSIONS.DASHBOARD), consultarDataDashboardController);
