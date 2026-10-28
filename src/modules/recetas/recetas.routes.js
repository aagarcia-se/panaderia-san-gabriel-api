import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarRecetaController, consultarRecetaController, consultarRecetasController, elminarRectaControler, ingresarRecetaController } from "./recetas.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const recetasRoute = Router();

// Las recetas se administran desde productos o desde materia prima.
const recipesPermission = requirePermission(PERMISSIONS.PRODUCTS, PERMISSIONS.RAW_MATERIALS);

recetasRoute.get("/consultar-recetas", authMiddleware, consultarRecetasController);
recetasRoute.get("/consultar-receta/:idProducto", authMiddleware, consultarRecetaController);
recetasRoute.post("/ingresar-receta", authMiddleware, recipesPermission, ingresarRecetaController);
recetasRoute.put("/actualizar-receta", authMiddleware, recipesPermission, actualizarRecetaController);
recetasRoute.delete("/elminar-receta/:idProducto", authMiddleware, recipesPermission, elminarRectaControler);
