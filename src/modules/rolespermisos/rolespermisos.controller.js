import {  actualizarRolPermisoService, consultarRolesPermisosPorIdService, consultarRolesPermisosService, consutarPemisosPorRolService, eliminarRolesPermisosBatchServices, eliminarRolPermisoService, ingresarRolesPermisosBatchServices, ingresarRolPermisoService,} from "./rolespermisos.service.js";

export const consultarRolesPermisosController = async (req, res, next) => {
  try {
    const rolesPermisos = await consultarRolesPermisosService();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      rolesPermisos,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const ingresarRolPermisoController = async (req, res, next) => {
  try {
    const rolPermiso = await ingresarRolPermisoService(req.body);
    const responseData = {
      status: 201,
      message: "Inserción exitosa",
      rol: rolPermiso,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const actualizarRolPermisoController = async (req, res, next) => {
  try {
    const rolPermisoActualizado = await actualizarRolPermisoService(req.body);
    const responseData = {
      status: 200,
      message: "Actualización exitosa",
      rol: rolPermisoActualizado,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error)
  }
};

export const eliminarRolPermisoController = async (req, res, next) => {
  try {
        const {idRolPermiso} = req.params;
        await eliminarRolPermisoService(idRolPermiso);
        const responseData = {
          status: 200,
          message: "Eliminación exitosa",
        };
        res.status(200).json(responseData);

    return result;
  } catch (error) {
    next(error);
  }
};

export const consultarPermisosPorRolController = async (req, res, next) => {
  try {
    const permisosPorRol = await consutarPemisosPorRolService();
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      permisosPorRol,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
}

export const ingresarRolesPermisosBatchController = async (req, res, next) => {
  try {

    const { dataRolesPermisos } = req.body;
    const rolPermiso = await ingresarRolesPermisosBatchServices(dataRolesPermisos);
    const responseData = {
      status: 201,
      message: "Inserción exitosa",
      permisosAsignados: rolPermiso,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const consultarRolesPermisosPorIdController = async (req, res, next) => {
  try {
    const {idRol} = req.params;
    const rolesPermisos = await consultarRolesPermisosPorIdService(idRol);
    const responseData = {
      status: 200,
      message: "Consulta exitosa",
      rolesPermisos,
    };
    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

export const eliminarRolesPermisosBatchController = async (req, res, next) => {
  try {

    const { dataRolesPermisos } = req.body;
    const rolPermiso = await eliminarRolesPermisosBatchServices(dataRolesPermisos);
    const responseData = {
      status: 201,
      message: "Inserción exitosa",
      permisosEliminados: rolPermiso,
    };
    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
};