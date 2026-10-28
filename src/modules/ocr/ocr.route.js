import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { uploadImage } from "../../middlewares/uploadImage.middleware.js";
import { procesarImagenOcrController } from "./ocr.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const ocrRoutes = Router();

const ocrPermission = requirePermission(PERMISSIONS.SALES, PERMISSIONS.PRODUCTION);

ocrRoutes.post("/procesar-imagen-ocr", authMiddleware, ocrPermission, uploadImage, procesarImagenOcrController);
