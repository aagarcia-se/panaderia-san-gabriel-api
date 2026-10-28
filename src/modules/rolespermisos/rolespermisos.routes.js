import { Router } from "express";
import { actualizarRolPermisoController, consultarPermisosPorRolController, consultarRolesPermisosController, consultarRolesPermisosPorIdController, eliminarRolesPermisosBatchController, eliminarRolPermisoController, ingresarRolesPermisosBatchController, ingresarRolPermisoController } from "./rolespermisos.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const rolesPermisosRoute = Router();

const usersPermission = requirePermission(PERMISSIONS.USERS);

rolesPermisosRoute.get("/consultarRolesPermisos", authMiddleware, usersPermission, consultarRolesPermisosController);
rolesPermisosRoute.post("/ingresarRolPermiso", authMiddleware, usersPermission, ingresarRolPermisoController);
rolesPermisosRoute.put("/actualizarRolPermiso", authMiddleware, usersPermission, actualizarRolPermisoController);
rolesPermisosRoute.delete("/eliminarRolPermiso/:idRolPermiso", authMiddleware, usersPermission, eliminarRolPermisoController);
rolesPermisosRoute.get("/consultarPermisosPorRol", authMiddleware, usersPermission, consultarPermisosPorRolController);
rolesPermisosRoute.post("/ingresarPermisosBatch", authMiddleware, usersPermission, ingresarRolesPermisosBatchController);
rolesPermisosRoute.get("/consultarRolesPermisosId/:idRol", authMiddleware, usersPermission, consultarRolesPermisosPorIdController);
rolesPermisosRoute.post("/ingresarPermisosBatch", authMiddleware, usersPermission, ingresarRolesPermisosBatchController);
rolesPermisosRoute.post("/eliminarRolPermisosBatch", authMiddleware, usersPermission, eliminarRolesPermisosBatchController);
