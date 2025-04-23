import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarRecetaController, consultarRecetaController, consultarRecetasController, elminarRectaControler, ingresarRecetaController } from "./recetas.controller.js";

export const recetasRoute = Router();

recetasRoute.get("/consultar-recetas", authMiddleware, consultarRecetasController);
recetasRoute.get("/consultar-receta/:idProducto", authMiddleware, consultarRecetaController);
recetasRoute.post("/ingresar-receta", authMiddleware, ingresarRecetaController);
recetasRoute.put("/actualizar-receta", authMiddleware, actualizarRecetaController);
recetasRoute.delete("/elminar-receta/:idProducto", authMiddleware, elminarRectaControler);


