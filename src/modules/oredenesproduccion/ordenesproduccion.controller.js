import { consultarDetalleOrdenProduccionService, consultarOrdenProduccionService, eliminarOrdenProduccionService } from "./ordenesproduccion.service.js";


export const consultarOrdenProduccionController = async (req, res, next) => {
  try {
    const ordenesProduccion = await consultarOrdenProduccionService();
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

export const consultarDetalleOrdenProduccionController = async (req, res, next) => {
  try {
    const {idOrdenProduccion} = req.params;
    const detalleOrden = await consultarDetalleOrdenProduccionService(idOrdenProduccion);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      detalleOrden,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const eliminarOrdenProduccionController = async (req, res, next) => {
  try {
    const { idOrdenProduccion } = req.params;
    await eliminarOrdenProduccionService(idOrdenProduccion);
    const responseData = {
      status: 200,
      message: "Eliminación exitosa",
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};