import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarEliminacionPorDiaController } from "./eliminacionesdiarias.controller.js";

export const eliminacionesRoute = Router();

eliminacionesRoute.get("/consultar-eliminacion-por-dia", authMiddleware, consultarEliminacionPorDiaController);
