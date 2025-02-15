import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarCategoriasController, ingresarCategoriaController } from "./categorias.controller.js";

export const categoriasRoute = Router();

categoriasRoute.post("/ingresarcategoria", authMiddleware, ingresarCategoriaController);
categoriasRoute.get("/consultarcategorias", authMiddleware, consultarCategoriasController);
