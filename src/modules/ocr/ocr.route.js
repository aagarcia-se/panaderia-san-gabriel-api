import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { uploadImage } from "../../middlewares/uploadImage.middleware.js";
import { procesarImagenOcrController } from "./ocr.controller.js";

export const ocrRoutes = Router();

ocrRoutes.post("/procesar-imagen-ocr", authMiddleware, uploadImage, procesarImagenOcrController);
