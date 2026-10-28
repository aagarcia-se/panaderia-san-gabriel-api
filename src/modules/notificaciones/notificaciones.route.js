import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { activarNotificacionesController, consultarActivacionesNotificacionesController, desactivarNotificacionesController, gestionarNotificacionController } from "./notificaciones.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const activacionNotificaciones = Router();

const notificationsPermission = requirePermission(PERMISSIONS.NOTIFICATIONS);

activacionNotificaciones.get("/consultar-activaciones-notificaciones", authMiddleware, notificationsPermission, consultarActivacionesNotificacionesController);
activacionNotificaciones.post("/activar-notificaciones", authMiddleware, notificationsPermission, activarNotificacionesController);
activacionNotificaciones.put("/desactivar-notificaciones", authMiddleware, notificationsPermission, desactivarNotificacionesController);
activacionNotificaciones.put("/gestion-de-notificaciones", authMiddleware, notificationsPermission, gestionarNotificacionController);
