import { Router } from "express";
import { actualizarPermisoController, consultarPermisosController, eliminarPermisoController, ingresarPermisoController } from "./permisos.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

export const permisosRoute = Router();

permisosRoute.get("/consultarPermisos", authMiddleware, consultarPermisosController);
permisosRoute.post("/ingresarPermiso", authMiddleware, ingresarPermisoController);
permisosRoute.put("/actualizarPermiso", authMiddleware, actualizarPermisoController);
permisosRoute.delete("/eliminarPermiso/:idPermiso", authMiddleware, eliminarPermisoController);