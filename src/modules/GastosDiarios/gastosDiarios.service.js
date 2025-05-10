
import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { ingresarGastosDiariosDao } from "./gastosDiarios.dao.js";

export const ingresarGastosDiariosService = async (idVenta, gastosDiarios) => {
    try {
        const resGastosDiarios = await ingresarGastosDiariosDao(idVenta, gastosDiarios);

        if (!resGastosDiarios) {
           throw new CustomError(getError(2));
        }
        return resGastosDiarios;
    } catch (error) {
        throw error;
    }
}