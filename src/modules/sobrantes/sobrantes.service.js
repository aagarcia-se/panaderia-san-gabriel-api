import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { ingresarSobranteDao } from "./sobrantes.dao.js";

export const ingresarSobranteService = async (sobrante) => {
    try {
        const result = await ingresarSobranteDao(sobrante);

        if (result === 0) {
            const error = getError(2);
            throw new CustomError(error);
        }

        return result;
    } catch (error) {
        throw error;
    }
};


