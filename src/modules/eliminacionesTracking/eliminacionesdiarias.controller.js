import { consultarEliminacionPorDiaService } from "./eliminacionesdiarias.service.js";

export const consultarEliminacionPorDiaController = async (req, res, next) => {
    try {
      const { procesoEliminado, fecha } = req.query;
      const  eliminacionesDiarias = await consultarEliminacionPorDiaService(procesoEliminado, fecha);
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        eliminacionesDiarias,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };