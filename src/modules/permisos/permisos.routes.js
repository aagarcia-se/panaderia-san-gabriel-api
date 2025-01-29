import { Router } from "express";
import { actualizarPermisoController, consultarPermisosController, eliminarPermisoController, ingresarPermisoController } from "./permisos.controller.js";

export const permisosRoute = Router();

permisosRoute.get("/consultarPermisos", consultarPermisosController);
permisosRoute.post("/ingresarPermiso", ingresarPermisoController);
permisosRoute.put("/actualizarPermiso", actualizarPermisoController);
permisosRoute.delete("/eliminarPermiso/:idPermiso", eliminarPermisoController);