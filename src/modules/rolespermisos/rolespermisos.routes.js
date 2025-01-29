import { Router } from "express";
import { actualizarRolPermisoController, consultarPermisosPorRolController, consultarRolesPermisosController, consultarRolesPermisosPorIdController, eliminarRolesPermisosBatchController, eliminarRolPermisoController, ingresarRolesPermisosBatchController, ingresarRolPermisoController } from "./rolespermisos.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

export const rolesPermisosRoute = Router();

rolesPermisosRoute.get("/consultarRolesPermisos", authMiddleware, consultarRolesPermisosController);
rolesPermisosRoute.post("/ingresarRolPermiso", authMiddleware, ingresarRolPermisoController);
rolesPermisosRoute.put("/actualizarRolPermiso", authMiddleware, actualizarRolPermisoController);
rolesPermisosRoute.delete("/eliminarRolPermiso/:idRolPermiso", authMiddleware, eliminarRolPermisoController);
rolesPermisosRoute.get("/consultarPermisosPorRol", authMiddleware, consultarPermisosPorRolController);
rolesPermisosRoute.post("/ingresarPermisosBatch", authMiddleware, ingresarRolesPermisosBatchController);
rolesPermisosRoute.get("/consultarRolesPermisosId/:idRol", authMiddleware, consultarRolesPermisosPorIdController);
rolesPermisosRoute.post("/ingresarPermisosBatch", authMiddleware, ingresarRolesPermisosBatchController);
rolesPermisosRoute.post("/eliminarRolPermisosBatch", authMiddleware, eliminarRolesPermisosBatchController);