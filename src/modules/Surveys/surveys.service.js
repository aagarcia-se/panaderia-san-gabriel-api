import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { ConsultarCampaniaActivaDao, consultarPregutasPorCampaniaDao, registrarRespuestasDao } from "./surveys.dao.js";

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

export const consultarPregutasPorCampaniaServices = async (idCampania) => {
  try {
    const preguntas = await consultarPregutasPorCampaniaDao(idCampania);

    if (preguntas === 0) {
      throw new CustomError(getError(1));
    }

    return preguntas;
  }
  catch (error) {
    throw error;
  }
};

export const registrarRespuestasServicio = async (data) => {
  try{
    const resInsert = await registrarRespuestasDao(data);
    if(resInsert === 0){
      throw new CustomError(getError(2));
    }

    return resInsert;
  }catch(error){
    throw error;
  }
}
