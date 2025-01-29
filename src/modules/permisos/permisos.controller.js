import { actualizarPermisoService, consultarPermisosService, eliminarPermisoService, ingresarPermisoService,  } from "./permisos.service.js";

export const consultarPermisosController = async (req, res, next) => {
  try {
    const permisos = await consultarPermisosService();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      permisos,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

export const ingresarPermisoController = async (req, res, next) => {
  try {
    const permisoInsertado = await ingresarPermisoService(req.body);
    const responseData = {
      status: 201,
      message: "Inserción exitosa",
      permiso: permisoInsertado,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
}

export const actualizarPermisoController = async (req, res, next) => {
  try {
    const permisoActualizado = await actualizarPermisoService(req.body);
    const responseData = {
      status: 200,
      message: "Actualización exitosa",
      permiso: permisoActualizado,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const eliminarPermisoController = async (req, res, next) => {
  try {
    const {idPermiso} = req.params;
    await eliminarPermisoService(idPermiso);
    const responseData = {
      status: 200,
      message: "Eliminación exitosa",
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};