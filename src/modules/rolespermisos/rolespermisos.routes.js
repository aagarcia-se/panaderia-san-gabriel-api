import { Router } from "express";
import { actualizarRolPermisoController, consultarPermisosPorRolController, consultarRolesPermisosController, consultarRolesPermisosPorIdController, eliminarRolesPermisosBatchController, eliminarRolPermisoController, ingresarRolesPermisosBatchController, ingresarRolPermisoController } from "./rolespermisos.controller.js";

export const rolesPermisosRoute = Router();

rolesPermisosRoute.get("/consultarRolesPermisos", consultarRolesPermisosController);
rolesPermisosRoute.post("/ingresarRolPermiso", ingresarRolPermisoController);
rolesPermisosRoute.put("/actualizarRolPermiso", actualizarRolPermisoController);
rolesPermisosRoute.delete("/eliminarRolPermiso/:idRolPermiso", eliminarRolPermisoController);
rolesPermisosRoute.get("/consultarPermisosPorRol", consultarPermisosPorRolController);
rolesPermisosRoute.post("/ingresarPermisosBatch", ingresarRolesPermisosBatchController);
rolesPermisosRoute.get("/consultarRolesPermisosId/:idRol", consultarRolesPermisosPorIdController);
rolesPermisosRoute.post("/ingresarPermisosBatch", ingresarRolesPermisosBatchController);
rolesPermisosRoute.post("/eliminarRolPermisosBatch", eliminarRolesPermisosBatchController);