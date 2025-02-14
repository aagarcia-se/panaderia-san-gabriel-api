import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarConsumosOrdenesProduccionController } from "./consumoordenes.controller.js";

export const consumoIngredientesRoute = Router();

consumoIngredientesRoute.get("/consultar-consumo-ingredientes/:idOrdenProduccion", authMiddleware, consultarConsumosOrdenesProduccionController);