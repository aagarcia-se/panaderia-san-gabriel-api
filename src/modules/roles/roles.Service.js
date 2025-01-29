import { consultarRolesDao, ingresarRolDao, actualizarRolDao, eliminarRolDao } from "./roles.Dao.js";
import Role from "./roles.Model.js";
import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";

export const consultarRolesServices = async () => {
  try {
    const rolesData = await consultarRolesDao();

    if (rolesData.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    // Transforma los datos en instancias de la clase Role
    const roles = rolesData.map((roleData) => new Role(roleData));

    return roles;
  } catch (error) {
    throw error;
  }
};

export const ingresarRolService = async (dataRol) => {
  try {
    const roles = new Role(dataRol);

    const result = await ingresarRolDao(roles);

    if (result === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const actualizarRolService = async (dataRol) => {
  try {
    const result = await actualizarRolDao(dataRol);
    if (result === 0) {
      const error = getError(3);
      throw new CustomError(error);
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const eliminarRolService = async (idRol) => {
  try {
    const result = await eliminarRolDao(idRol);
    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw error;
  }
};
