import { Router } from "express";
import authMiddleware from "../../middlewares/authMiddleware.js";
import { ConsultarCampaniaActivaController, consultarEncuestaDetalleController, consultarEncuestasListController, consultarPregutasPorCampaniaController, crearCampaniaController, elminarEncuestaController, registrarRespuestasController } from "./surveys.controller.js";

export const surveysRoute = Router();    

surveysRoute.get("/consultar-campania", ConsultarCampaniaActivaController);
surveysRoute.get("/consultar-preguntas-por-campania", consultarPregutasPorCampaniaController);
surveysRoute.post("/registrar-respuestas", registrarRespuestasController);
surveysRoute.post("/crear-campania", authMiddleware, crearCampaniaController);
surveysRoute.get("/consultar-encuestas", consultarEncuestasListController);
surveysRoute.delete("/eliminar-encuesta", elminarEncuestaController);
surveysRoute.get("/consultar-encuesta-detalle", consultarEncuestaDetalleController);