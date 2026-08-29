import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { ingresarVentaBatchController } from "./ventasbatch.controller.js";
import { uploadAnyFile, uploadFile } from "../../middlewares/upload.middleware.js";

export const ventasBatchRoutes = Router();

// Ruta para ingresar ventas por batch
ventasBatchRoutes.post("/ventas-por-lotes", authMiddleware, uploadAnyFile, ingresarVentaBatchController);

