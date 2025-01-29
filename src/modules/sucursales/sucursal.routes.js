import { Router } from "express";
import {
  consultarSucursalesController,
  ingresarSucursalController,
  eliminarSucursalController,
  actualizarSucursalController,
} from "./sucursales.controller.js";

export const sucursalesRoute = Router();

sucursalesRoute.get("/getSucursales", consultarSucursalesController);
sucursalesRoute.post("/ingresarSucursal", ingresarSucursalController);
sucursalesRoute.put("/actualizarSucursal", actualizarSucursalController);
sucursalesRoute.delete("/eliminarSucursal/:idSucursal", eliminarSucursalController);

