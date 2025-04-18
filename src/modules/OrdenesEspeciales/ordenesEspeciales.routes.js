import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarOrdenesEspecialesController, consultarOrdenEspecialByIdController, ingresarOrdenEspecialController } from "./ordenesEspeciales.controller.js";

export const ordenEspecialRoutes = Router();

ordenEspecialRoutes.post("/ingresar-orden-especial", authMiddleware, ingresarOrdenEspecialController);
ordenEspecialRoutes.get("/consultar-ordenes-especiales", authMiddleware, consultarOrdenesEspecialesController);
ordenEspecialRoutes.get("/consultar-orden-especial-id/:idOrdenEspecial", authMiddleware, consultarOrdenEspecialByIdController);