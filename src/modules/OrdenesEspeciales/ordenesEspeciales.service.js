import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { actualizarOrdenEspecialByIdDao, consultarOrdeEspecialByIdDao, consultarOrdenesEspecialesDao, elminarOrdenEspecialByIdDao, ingresarOrdenEspecialDao } from "./ordenesEspeciales.dao.js";

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

export const consultarOrdenesEspecialesServices = async (idRol, idSucursal) => {
    try{
        const ordenesEspeciales = await consultarOrdenesEspecialesDao(idRol, idSucursal);
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

export const elminarOrdenEspecialByIdServices = async (idOrdenEspecial) =>{
    try{
      const resDelete = await elminarOrdenEspecialByIdDao(idOrdenEspecial);

      if(resDelete === 0){
        const error = getError(3);
        throw new CustomError(error);
      }

      return idOrdenEspecial;
    }catch(error){
      throw error;
    }
}

export const actualizarOrdenEspecialByIdServices = async (ordenesEspeciales) => {
    try{
        const resUpdate = await actualizarOrdenEspecialByIdDao(ordenesEspeciales);
        if(resUpdate === 0){
            const error = getError(3);
            throw new CustomError(error);
        }
        return resUpdate;
    }catch(error){
        throw error;
    }
}