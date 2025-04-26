import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { descontarStockController } from "./descontarStock.controller.js";

export const descontarStockRoute = Router();

descontarStockRoute.post("/descontar-stock", authMiddleware, descontarStockController);
