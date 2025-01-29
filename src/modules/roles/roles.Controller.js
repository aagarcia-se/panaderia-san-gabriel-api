import { consultarRolesServices,  actualizarRolService, eliminarRolService, ingresarRolService } from "./roles.Service.js";

export const consultarRolesController = async (req, res, next) => {
  try {
    const roles = await consultarRolesServices();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      roles,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const ingresarRolController = async (req, res, next) => {
  try {
    const rolInsertado = await ingresarRolService(req.body);
    const responseData = {
      status: 201,
      message: "Inserción exitosa",
      idRol: rolInsertado,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const actualizarRolController = async (req, res, next) => {
  try {
    const rolActualizado = await actualizarRolService(req.body);
    const responseData = {
      status: 200,
      message: "Actualización exitosa",
      rol: rolActualizado,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};

export const eliminarRolController = async (req, res, next) => {
  try {
    const {idRol} = req.params;
    await eliminarRolService(idRol);
    const responseData = {
      status: 200,
      message: "Eliminación exitosa",
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error); // Pasa el error al middleware de manejo de errores
  }
};
