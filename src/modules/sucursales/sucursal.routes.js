import { Router } from "express";
import {
  consultarSucursalesController,
  ingresarSucursalController,
  eliminarSucursalController,
  actualizarSucursalController,
} from "./sucursales.controller.js";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const sucursalesRoute = Router();

const branchesPermission = requirePermission(PERMISSIONS.BRANCHES);

// La consulta se mantiene disponible para usuarios autenticados porque
// se usa en selectores de otros módulos.
sucursalesRoute.get("/getSucursales", authMiddleware, consultarSucursalesController);
sucursalesRoute.post("/ingresarSucursal", authMiddleware, branchesPermission, ingresarSucursalController);
sucursalesRoute.put("/actualizar-sucursal", authMiddleware, branchesPermission, actualizarSucursalController);
sucursalesRoute.delete("/eliminarSucursal/:idSucursal", authMiddleware, branchesPermission, eliminarSucursalController);
