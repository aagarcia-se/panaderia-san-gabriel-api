import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { requirePermission } from "../../middlewares/authorizationMiddleware.js";
import { PERMISSIONS } from "../../auth/permissions.js";
import { ConsultarCampaniaActivaController, consultarEncuestaDetalleController, consultarEncuestasListController, consultarPregutasPorCampaniaController, crearCampaniaController, elminarEncuestaController, registrarRespuestasController } from "./surveys.controller.js";

export const surveysRoute = Router();

const surveysPermission = requirePermission(PERMISSIONS.SURVEYS);

// Endpoints públicos usados por los clientes para responder encuestas.
surveysRoute.get("/consultar-campania", ConsultarCampaniaActivaController);
surveysRoute.get("/consultar-preguntas-por-campania", consultarPregutasPorCampaniaController);
surveysRoute.post("/registrar-respuestas", registrarRespuestasController);

// Administración de encuestas: requiere autenticación y permiso.
surveysRoute.post("/crear-campania", authMiddleware, surveysPermission, crearCampaniaController);
surveysRoute.get("/consultar-encuestas", authMiddleware, surveysPermission, consultarEncuestasListController);
surveysRoute.delete("/eliminar-encuesta", authMiddleware, surveysPermission, elminarEncuestaController);
surveysRoute.get("/consultar-encuesta-detalle", authMiddleware, surveysPermission, consultarEncuestaDetalleController);
