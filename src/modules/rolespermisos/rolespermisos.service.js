import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarRolPermisoDao, consultarPermisosPorRolDao, consultarRolesPermisosDao, consultarRolesPermisosPorIdDao, eliminarRolesPermisosBatchDao, eliminarRolPermisoDao, ingresarRolesPermisosBatchDao, ingresarRolPermisoDao } from "./rolespermisos.dao.js";

export const consultarRolesPermisosService = async () => {
  try {
    const rolesPermisosData = await consultarRolesPermisosDao();

    if (rolesPermisosData.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return rolesPermisosData;
  } catch (error) {
    throw error;
  }
}

export const ingresarRolPermisoService = async (dataRolPermiso) => {
  try {
    const result = await ingresarRolPermisoDao(dataRolPermiso);

    if (result === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export const actualizarRolPermisoService = async (dataRolPermiso) => {
  try {
    const result = await actualizarRolPermisoDao(dataRolPermiso);
    if (result === 0) {
      const error = getError(3);
      throw new CustomError(error);
    }
    return result;
  } catch (error) {
    throw error;
  }
}

export const eliminarRolPermisoService = async (idRol) => {
  try {
    const result = await eliminarRolPermisoDao(idRol);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
}

export const consutarPemisosPorRolService = async () => {
    try {
        const result = await consultarPermisosPorRolDao();
        if (result.length === 0) {
            const error = getError(1);
            throw new CustomError(error);
          }
        return result;
    } catch (error) { 
        throw error;
    }

}

export const ingresarRolesPermisosBatchServices = async (dataRolesPermisos) => {
  try {
    const result = await ingresarRolesPermisosBatchDao(dataRolesPermisos);

    if (result === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }

}

export const consultarRolesPermisosPorIdService = async (id) => {
  try {
    const rolesPermisosData = await consultarRolesPermisosPorIdDao(id);

    if (rolesPermisosData.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    return rolesPermisosData;
  } catch (error) {
    throw error;
  }
}

export const eliminarRolesPermisosBatchServices = async (dataRolesPermisos) => {
  try {
    const result = await eliminarRolesPermisosBatchDao(dataRolesPermisos);

    if (result === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }

}