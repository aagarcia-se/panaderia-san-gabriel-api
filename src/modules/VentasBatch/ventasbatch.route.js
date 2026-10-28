import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { ingresarVentaBatchController } from "./ventasbatch.controller.js";
import { uploadAnyFile, uploadFile } from "../../middlewares/upload.middleware.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const ventasBatchRoutes = Router();

// Ruta para ingresar ventas por batch
ventasBatchRoutes.post("/ventas-por-lotes", authMiddleware, requirePermission(PERMISSIONS.SALES), uploadAnyFile, ingresarVentaBatchController);
