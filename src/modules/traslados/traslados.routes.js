import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { consultarDetalleDeTraladoController, consultarTrasladosController, eliminarTrasladoController, registrarTrasladoController } from "./traslados.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const trasladosRoute = Router();

// Los traslados afectan inventario: se permiten con permiso de stock o producción.
const stockOrProductionPermission = requirePermission(PERMISSIONS.STOCK, PERMISSIONS.PRODUCTION);

trasladosRoute.post("/registrar-traslado", authMiddleware, stockOrProductionPermission, registrarTrasladoController);
trasladosRoute.get("/consultar-traslados", authMiddleware, consultarTrasladosController);
trasladosRoute.get("/consultar-detalle-traslado/:idTraslado", authMiddleware, consultarDetalleDeTraladoController);
trasladosRoute.delete("/eliminar-traslado/:idTraslado", authMiddleware, stockOrProductionPermission, eliminarTrasladoController);
