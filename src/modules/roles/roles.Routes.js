import { Router } from "express";
import { consultarRolesController, ingresarRolController, actualizarRolController, eliminarRolController } from "./roles.Controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const rolesRoute = Router();

const usersPermission = requirePermission(PERMISSIONS.USERS);

rolesRoute.get("/consultarRoles", authMiddleware, usersPermission, consultarRolesController);
rolesRoute.post("/ingresarRol", authMiddleware, usersPermission, ingresarRolController);
rolesRoute.put("/actualizarRol/", authMiddleware, usersPermission, actualizarRolController);
rolesRoute.delete("/eliminarRol/:idRol", authMiddleware, usersPermission, eliminarRolController);
