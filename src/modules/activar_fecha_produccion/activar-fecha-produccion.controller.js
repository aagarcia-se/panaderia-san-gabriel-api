import { consultarFechasProduccionService, ingresarFechaProduccionService } from "./activar-fecha-produccion.service.js";

export const consultarFechasProduccionController = async (req, res, next) => {
  try {
    const { fecha } = req.query;
    const fechaConsultada = await consultarFechasProduccionService(fecha);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      diaProduccion: fechaConsultada,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const ingresarFechaProduccionController = async (req, res, next) => {
  try {
    const fechaIngresada = await ingresarFechaProduccionService(req.body);
    const responseData = {
      status: 200,
      message: "Ingreso exitoso",
      fechaId: fechaIngresada,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};
