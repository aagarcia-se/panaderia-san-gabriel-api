import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarPermisoDao, consultarPermisosDao, eliminarPermisoDao, ingresarPermisoDao } from "./permisos.dao.js";


export const consultarPermisosService = async () => {
    try {
        const permisosData = await consultarPermisosDao();

        if (permisosData.length === 0) {
            const error = getError(1);
            throw new CustomError(error);
        }

        return permisosData;
    } catch (error) {
        throw error;
    }
}

export const ingresarPermisoService = async (dataPermiso) => {
    try {

        const result = await ingresarPermisoDao(dataPermiso);

        if (result === 0) {
            const error = getError(2);
            throw new CustomError(error);
        }

        return result;
    } catch (error) {
        throw error;
    }
}


export const actualizarPermisoService = async (dataPermiso) => {
    try {
        const result = await actualizarPermisoDao(dataPermiso);
        if (result === 0) {
            const error = getError(3);
            throw new CustomError(error);
        }
        return result;
    } catch (error) {
        throw error;
    }
};

export const eliminarPermisoService = async (idPermiso) => {
    try {
        const result = await eliminarPermisoDao(idPermiso);
        if (result === 0) {
            const error = getError(4);
            throw new CustomError(error);
        }

        return result;
    } catch (error) {
        throw error;
    }
};