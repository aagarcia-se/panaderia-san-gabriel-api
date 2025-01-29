import { Router } from "express";
import { consultarRolesController, ingresarRolController, actualizarRolController, eliminarRolController } from "./roles.Controller.js";

export const rolesRoute = Router();

rolesRoute.get("/consultarRoles", consultarRolesController);
rolesRoute.post("/ingresarRol", ingresarRolController);
rolesRoute.put("/actualizarRol/", actualizarRolController);
rolesRoute.delete("/eliminarRol/:idRol", eliminarRolController);
