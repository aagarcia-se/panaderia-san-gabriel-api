import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarEliminacionPorDiaDao } from "./eliminacionesdiarias.dao.js";

export const consultarEliminacionPorDiaService = async (procesoEliminado, fecha) => {
    try {
        const eliminacion = await consultarEliminacionPorDiaDao(procesoEliminado, fecha);
        if (!eliminacion) {
            const error = getError(1);
            throw new CustomError(error);
        }
        return eliminacion;
    } catch (error) {
        throw error;
    }
};