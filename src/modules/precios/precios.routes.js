import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarPrecioProductoController, consultarPreciosProductosController, eliminarPrecioProductoController, ingresarPrecioProductoController } from "./precios.controller.js";

export const preciosRoute = Router();

preciosRoute.post("/ingresarPrecio", authMiddleware, ingresarPrecioProductoController);
preciosRoute.get("/consultarPrecios", authMiddleware, consultarPreciosProductosController);
preciosRoute.put("/actualizarPrecio/", authMiddleware, actualizarPrecioProductoController);
preciosRoute.delete("/elminarPrecio/:idProducto", authMiddleware, eliminarPrecioProductoController);
