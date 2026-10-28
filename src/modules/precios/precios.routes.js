import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarPrecioProductoController, consultarPreciosProductosController, eliminarPrecioProductoController, ingresarPrecioProductoController } from "./precios.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const preciosRoute = Router();

const productsPermission = requirePermission(PERMISSIONS.PRODUCTS);

preciosRoute.post("/ingresarPrecio", authMiddleware, productsPermission, ingresarPrecioProductoController);
preciosRoute.get("/consultarPrecios", authMiddleware, consultarPreciosProductosController);
preciosRoute.put("/actualizarPrecio/", authMiddleware, productsPermission, actualizarPrecioProductoController);
preciosRoute.delete("/elminarPrecio/:idProducto", authMiddleware, productsPermission, eliminarPrecioProductoController);
