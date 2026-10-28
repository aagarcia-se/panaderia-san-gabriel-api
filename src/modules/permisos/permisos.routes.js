import { Router } from "express";
import { actualizarPermisoController, consultarPermisosController, eliminarPermisoController, ingresarPermisoController } from "./permisos.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const permisosRoute = Router();

const usersPermission = requirePermission(PERMISSIONS.USERS);

permisosRoute.get("/consultarPermisos", authMiddleware, usersPermission, consultarPermisosController);
permisosRoute.post("/ingresarPermiso", authMiddleware, usersPermission, ingresarPermisoController);
permisosRoute.put("/actualizarPermiso", authMiddleware, usersPermission, actualizarPermisoController);
permisosRoute.delete("/eliminarPermiso/:idPermiso", authMiddleware, usersPermission, eliminarPermisoController);
