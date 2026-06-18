import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { uploadImage } from "../../middlewares/uploadImage.middleware.js";
import { IngresarVentasAIController } from "./ventasAI.controller.js";

export const ventasAIRoutes = Router();

ventasAIRoutes.post("/venta-AI", authMiddleware, uploadImage, IngresarVentasAIController);
