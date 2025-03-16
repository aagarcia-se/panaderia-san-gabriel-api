import { Router } from "express";
import {
  consultarSucursalesController,
  ingresarSucursalController,
  eliminarSucursalController,
  actualizarSucursalController,
} from "./sucursales.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";

export const sucursalesRoute = Router();

sucursalesRoute.get("/getSucursales", authMiddleware, consultarSucursalesController);
sucursalesRoute.post("/ingresarSucursal", authMiddleware, ingresarSucursalController);
sucursalesRoute.put("/actualizar-sucursal", authMiddleware, actualizarSucursalController);
sucursalesRoute.delete("/eliminarSucursal/:idSucursal", authMiddleware, eliminarSucursalController);

