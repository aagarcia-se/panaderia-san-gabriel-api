import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDataDashboardController } from "./dashboardData.controller.js";

export const dashboardDataRoute = Router();

dashboardDataRoute.get("/consultar-data-dashboard", authMiddleware, consultarDataDashboardController);
