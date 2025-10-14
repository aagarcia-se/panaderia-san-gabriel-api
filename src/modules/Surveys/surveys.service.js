import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { ConsultarCampaniaActivaDao } from "./surveys.dao.js";

export const ConsultarCampaniaActivaService = async (fechaHoy) => {
  try {
    const campaniaActiva = await ConsultarCampaniaActivaDao(fechaHoy);

    if (campaniaActiva === 0) {
      throw new CustomError(getError(1));
    }

    return campaniaActiva;
  }
  catch (error) {
    throw error;
  }
};



