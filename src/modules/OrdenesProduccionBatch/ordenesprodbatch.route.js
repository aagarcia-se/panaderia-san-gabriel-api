import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { uploadFile } from "../../middlewares/upload.middleware.js";
import { ingresarOrdenProduccionBatchController } from "./ordenesprodbatch.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const ordenesBatchRoutes = Router();

ordenesBatchRoutes.post("/ingresar-orden-batch", authMiddleware, requirePermission(PERMISSIONS.PRODUCTION), uploadFile("ordenProduccionBatch"), ingresarOrdenProduccionBatchController);
