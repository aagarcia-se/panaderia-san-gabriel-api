import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarImgProductoController, eliminarImgProductoController, ingresarImgProductoController } from "./imgproductos.controller.js";

export const productoImgRoutes = Router();

productoImgRoutes.post("/ingresar-img-producto", authMiddleware, ingresarImgProductoController);
productoImgRoutes.put("/actualizar-img-producto/", authMiddleware, actualizarImgProductoController);
productoImgRoutes.delete("/eliminar-img-producto/:idProducto", authMiddleware, eliminarImgProductoController);
