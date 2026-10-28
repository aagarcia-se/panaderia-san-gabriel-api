import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { uploadImage } from "../../middlewares/uploadImage.middleware.js";
import { IngresarVentasAIController } from "./ventasAI.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const ventasAIRoutes = Router();

ventasAIRoutes.post("/venta-AI", authMiddleware, requirePermission(PERMISSIONS.SALES), uploadImage, IngresarVentasAIController);
