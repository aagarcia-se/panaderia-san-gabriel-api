import { Router } from "express";
import { ConsultarCampaniaActivaController, consultarPregutasPorCampaniaController, registrarRespuestasController } from "./surveys.controller.js";

export const surveysRoute = Router();    

surveysRoute.get("/consultar-campania", ConsultarCampaniaActivaController);
surveysRoute.get("/consultar-preguntas-por-campania", consultarPregutasPorCampaniaController);
surveysRoute.post("/registrar-respuestas", registrarRespuestasController);
