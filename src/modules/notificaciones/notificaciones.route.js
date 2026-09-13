import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { activarNotificacionesController, consultarActivacionesNotificacionesController, desactivarNotificacionesController, gestionarNotificacionController } from "./notificaciones.controller.js";

export const activacionNotificaciones = Router();

activacionNotificaciones.get("/consultar-activaciones-notificaciones", authMiddleware, consultarActivacionesNotificacionesController);
activacionNotificaciones.post("/activar-notificaciones", authMiddleware, activarNotificacionesController);
activacionNotificaciones.put("/desactivar-notificaciones", authMiddleware, desactivarNotificacionesController);
activacionNotificaciones.put("/gestion-de-notificaciones", authMiddleware, gestionarNotificacionController);
