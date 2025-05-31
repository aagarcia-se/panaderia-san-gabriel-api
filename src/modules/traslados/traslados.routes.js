import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleDeTraladoController, consultarTrasladosController, eliminarTrasladoController, registrarTrasladoController } from "./traslados.controller.js";

export const trasladosRoute = Router();

trasladosRoute.post("/registrar-traslado", authMiddleware, registrarTrasladoController);
trasladosRoute.get("/consultar-traslados", authMiddleware, consultarTrasladosController);
trasladosRoute.get("/consultar-detalle-traslado/:idTraslado", authMiddleware, consultarDetalleDeTraladoController);
trasladosRoute.delete("/eliminar-traslado/:idTraslado", authMiddleware, eliminarTrasladoController);



