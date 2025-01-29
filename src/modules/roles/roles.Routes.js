import { Router } from "express";
import { consultarRolesController, ingresarRolController, actualizarRolController, eliminarRolController } from "./roles.Controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

export const rolesRoute = Router();

rolesRoute.get("/consultarRoles", authMiddleware, consultarRolesController);
rolesRoute.post("/ingresarRol", authMiddleware, ingresarRolController);
rolesRoute.put("/actualizarRol/", authMiddleware, actualizarRolController);
rolesRoute.delete("/eliminarRol/:idRol", authMiddleware, eliminarRolController);
