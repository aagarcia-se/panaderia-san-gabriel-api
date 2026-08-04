import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarCategoriaController, consultarCategoriasController, eliminarCategoriaController, ingresarCategoriaController } from "./categorias.controller.js";

export const categoriasRoute = Router();

categoriasRoute.post("/ingresarcategoria", authMiddleware, ingresarCategoriaController);
categoriasRoute.get("/consultarcategorias", authMiddleware, consultarCategoriasController);
categoriasRoute.put("/actualizarcategoria", authMiddleware, actualizarCategoriaController);
categoriasRoute.delete("/eliminarcategoria/:id", authMiddleware, eliminarCategoriaController);

