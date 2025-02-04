import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarProductoController, consultarProductosController, desactivarProductoController, elminarProductoController, ingresarProductoController } from "./productos.controller.js";

export const productosRoute = Router();

productosRoute.post("/ingresarProducto", authMiddleware, ingresarProductoController);
productosRoute.get("/consultarProductos", authMiddleware, consultarProductosController);
productosRoute.put("/actualizarProducto/", authMiddleware, actualizarProductoController);
productosRoute.delete("/elminarProducto/:idProducto", authMiddleware, elminarProductoController);
productosRoute.delete("/desactivarProducto/:idProducto", authMiddleware, desactivarProductoController);
