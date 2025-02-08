import { consultarDetalleOrdenProduccionService } from "./ordenesproduccion.service.js";


export const consultarDetalleOrdenProduccionController = async (req, res, next) => {
  try {
    const ordenesProduccion = await consultarDetalleOrdenProduccionService();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      ordenesProduccion,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};