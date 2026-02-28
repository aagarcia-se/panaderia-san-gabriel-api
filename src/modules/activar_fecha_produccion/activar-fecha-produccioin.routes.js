import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarFechasProduccionController, ingresarFechaProduccionController } from "./activar-fecha-produccion.controller.js";

export const activarFechaProduccionRoute = Router();

activarFechaProduccionRoute.get("/fecha-produccion", authMiddleware, consultarFechasProduccionController);
activarFechaProduccionRoute.post("/activar-fecha-produccion", authMiddleware, ingresarFechaProduccionController);
