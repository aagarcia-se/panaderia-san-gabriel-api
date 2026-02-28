import { consultarFechasProduccionDao, ingresarFechaProduccionDao } from "./activar-fecha-produccion.dao.js";

export const consultarFechasProduccionService = async (fecha) => {
    try{
        const result = await consultarFechasProduccionDao(fecha);
        if (result.length === 0) {
            return [];
        }else{
            return result;
        }
    }
    catch(error){
        throw error;
    }
};

export const ingresarFechaProduccionService = async (data) => {
    try{
        const result = await ingresarFechaProduccionDao(data);
        if (result === 0) {
            const error = getError(2);
            throw new CustomError(error);
        }
        return result;
    }
    catch(error){
        throw error;
    }
};