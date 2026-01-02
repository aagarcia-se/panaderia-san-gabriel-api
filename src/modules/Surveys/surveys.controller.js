import { ConsultarCampaniaActivaService, consultarEncuestaDetalleService, consultarEncuestasListServices, consultarPregutasPorCampaniaServices, crearCampaniaService, elminarEncuestaService, registrarRespuestasServicio } from "./surveys.service.js";

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
          message: "Ingreso exitosa",
          IngresarRespuestas,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const crearCampaniaController = async (req, res, next) => {
    try {
        const idCampania = await crearCampaniaService(req.body);
        const responseData = {
          status: 200,
          message: "Ingreso exitosa",
          idCampania,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const consultarEncuestasListController = async (req, res, next) => {
    try {
        const encuestas = await consultarEncuestasListServices();
        const responseData = {
            status: 200,
            message: "Consulta exitosa",
            encuestas,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const elminarEncuestaController = async (req, res, next) => {
    try {
        const {idCampania} = req.query;
        const result = await elminarEncuestaService(idCampania);
        const responseData = {
            status: 200,
            message: "Eliminación exitosa",
            result,
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}

export const consultarEncuestaDetalleController = async (req, res, next) => {
    try {
        const {idCampania} = req.query;
        const campania = await consultarEncuestaDetalleService(idCampania);
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