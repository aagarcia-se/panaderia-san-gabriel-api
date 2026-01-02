import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { ConsultarCampaniaActivaDao, consultarEncuestaDetalleDao, consultarEncuestasDao, consultarEncuestasListDao, consultarPregutasPorCampaniaDao, crearCampaniaDao, elminarEncuestaDao, registrarRespuestasDao } from "./surveys.dao.js";

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

export const crearCampaniaService = async (data) => {
  try{
    const idCampania = await crearCampaniaDao(data);
    
    if(idCampania == 0){
      throw new CustomError(getError(2));
    }

    return idCampania;
  }catch(error){
    throw error;
  }
}

export const consultarEncuestasServices = async () => {
  try {
    const campaniaActiva = await consultarEncuestasDao();

    if (campaniaActiva === 0) {
      throw new CustomError(getError(1));
    }

    return campaniaActiva;
  }
  catch (error) {
    throw error;
  }
};

export const consultarEncuestasListServices = async () => {
  try {
    const encuestas = await consultarEncuestasListDao();
    
    if (encuestas === 0) {
      throw new CustomError(getError(1));
    }
    
    return encuestas;
  }
  catch (error) {
    throw error;
  }
};

export const elminarEncuestaService = async (idCampania) => {
  try {
    const result = await elminarEncuestaDao(idCampania);
    return result;
  } catch (error) {
    throw error;
  }
};

export const consultarEncuestaDetalleService = async (idCampania) => {
  try {
    const result = await consultarEncuestaDetalleDao(idCampania);
    return result;
  } catch (error) {
    throw error;
  }
};


