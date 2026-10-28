import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarCategoriaController, consultarCategoriasController, desctivarCategoriaController, eliminarCategoriaController, ingresarCategoriaController } from "./categorias.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const categoriasRoute = Router();

const categoriesPermission = requirePermission(PERMISSIONS.CATEGORIES);

categoriasRoute.post("/ingresarcategoria", authMiddleware, categoriesPermission, ingresarCategoriaController);
categoriasRoute.get("/consultarcategorias", authMiddleware, consultarCategoriasController);
categoriasRoute.put("/actualizarcategoria", authMiddleware, categoriesPermission, actualizarCategoriaController);
categoriasRoute.delete("/eliminarcategoria/:id", authMiddleware, categoriesPermission, eliminarCategoriaController);
categoriasRoute.delete("/descativar-categoria/:idCategoria", authMiddleware, categoriesPermission, desctivarCategoriaController);
