import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarProductoController, consultarProductosConPreciosController, consultarProductosController, consultarProductosParaInventarioController, desactivarProductoController, elminarProductoController, ingresarProductoController } from "./productos.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const productosRoute = Router();

const productsPermission = requirePermission(PERMISSIONS.PRODUCTS);

productosRoute.post("/ingresarProducto", authMiddleware, productsPermission, ingresarProductoController);
productosRoute.get("/consultarProductos", authMiddleware, consultarProductosController);
productosRoute.put("/actualizarProducto/", authMiddleware, productsPermission, actualizarProductoController);
productosRoute.delete("/elminarProducto/:idProducto", authMiddleware, productsPermission, elminarProductoController);
productosRoute.delete("/desactivarProducto/:idProducto", authMiddleware, productsPermission, desactivarProductoController);
productosRoute.get("/consultarProductosParaInventario", authMiddleware, consultarProductosParaInventarioController);
productosRoute.get("/productos-con-precios", authMiddleware, consultarProductosConPreciosController);
