import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { actualizarOrdenEspecialByIdController, consultarOrdenesEspecialesController, consultarOrdenEspecialByIdController, eliminarOrdenEspecialByIdController, ingresarOrdenEspecialController } from "./ordenesEspeciales.controller.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";

export const ordenEspecialRoutes = Router();

const specialOrdersPermission = requirePermission(PERMISSIONS.SPECIAL_ORDERS);

ordenEspecialRoutes.post("/ingresar-orden-especial", authMiddleware, specialOrdersPermission, ingresarOrdenEspecialController);
ordenEspecialRoutes.get("/consultar-ordenes-especiales", authMiddleware, consultarOrdenesEspecialesController);
ordenEspecialRoutes.get("/consultar-orden-especial-id/:idOrdenEspecial", authMiddleware, consultarOrdenEspecialByIdController);
ordenEspecialRoutes.delete("/eliminar-orden-especial/:idOrdenEspecial", authMiddleware, specialOrdersPermission, eliminarOrdenEspecialByIdController);
ordenEspecialRoutes.put("/actualizar-orden-especial", authMiddleware, specialOrdersPermission, actualizarOrdenEspecialByIdController);
