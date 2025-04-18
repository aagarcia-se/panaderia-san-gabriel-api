import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarOrdeEspecialByIdDao, consultarOrdenesEspecialesDao, ingresarOrdenEspecialDao } from "./ordenesEspeciales.dao.js";

export const ingresarOrdenEspecialServices = async (ordenEspecial) => {
    try{

        const resOrdenEspecial = await ingresarOrdenEspecialDao(ordenEspecial);
        if(resOrdenEspecial === 0){
            const errorInfo = getError(2);
            throw new CustomError(errorInfo);
        }

        return resOrdenEspecial;
    }catch(error){
        throw error;
    }
}

export const consultarOrdenesEspecialesServices = async () => {
    try{
        const ordenesEspeciales = await consultarOrdenesEspecialesDao();
        if (ordenesEspeciales.length === 0) {
            const error = getError(1);
            throw new CustomError(error);
        }

        return ordenesEspeciales;
    }catch(error){
        throw error;
    }
}

export const consultarOrdenEspecialByIdServices = async (idOrdenEspecial) => {
    try{
        const ordenEspecial = await consultarOrdeEspecialByIdDao(idOrdenEspecial);
        if (ordenEspecial === 0) {
            const error = getError(4);
            throw new CustomError(error);
          }

          return ordenEspecial;
    }catch(error){
        throw error;
    }
}

