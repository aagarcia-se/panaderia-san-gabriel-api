import { Router } from "express";
import healthController from "./health.controller.js";

export const healthRoutes = Router();

healthRoutes.get("/health",
  healthController.getHealth
);

healthRoutes.get(
  "/health/db",
  healthController.getDatabaseHealth
);