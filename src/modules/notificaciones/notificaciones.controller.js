import { activarNotificacionesService, consultarActivacionesNotificacionesService, desactivarNotificacionesService, gestionarNotificacionServices } from "./notificaciones.service.js";

export const consultarActivacionesNotificacionesController = async (req, res, next) => {
  try {
    const usuariosNoti = await consultarActivacionesNotificacionesService();
    const responseData = {
      status: 200,
      usuariosNoti,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

export const activarNotificacionesController = async (req, res, next) => {
  try {
    const usuariosNoti = await activarNotificacionesService(req.body);
    const responseData = {
      status: 200,
      usuariosNoti,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

export const desactivarNotificacionesController = async (req, res, next) => {
  try {
    const usuariosNoti = await desactivarNotificacionesService(req.body);
    const responseData = {
      status: 200,
      usuariosNoti,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

export const gestionarNotificacionController = async (req, res, next) => {
  try {
    const usuariosNoti = await gestionarNotificacionServices(req.body);
    const responseData = {
      status: 200,
      usuariosNoti,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}