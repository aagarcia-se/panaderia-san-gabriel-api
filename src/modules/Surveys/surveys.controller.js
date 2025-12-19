import { ConsultarCampaniaActivaService, consultarPregutasPorCampaniaServices, registrarRespuestasServicio } from "./surveys.service.js";

export const ConsultarCampaniaActivaController = async (req, res, next) => {
    try {
        const {fechaHoy} = req.query;

        const campania   = await ConsultarCampaniaActivaService(fechaHoy);
        const responseData = {
          status: 200,
          message: "Consulta exitosa",
          campania,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const consultarPregutasPorCampaniaController = async (req, res, next) => {
    try {

        const {idCampania} = req.query;

        const preguntas   = await consultarPregutasPorCampaniaServices(idCampania);
        const responseData = {
          status: 200,
          message: "Consulta exitosa",
          preguntas,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const registrarRespuestasController = async (req, res, next) => {
    try {
        const IngresarRespuestas = await registrarRespuestasServicio(req.body);
        const responseData = {
          status: 200,
          message: "Consulta exitosa",
          IngresarRespuestas,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}