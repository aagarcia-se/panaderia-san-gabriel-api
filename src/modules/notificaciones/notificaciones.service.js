import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { activarNotificacionesDao, consultarActivacionesNotificacionesDao, desactivarNotificacionesDao, gestionarNotificacionDao } from "./notificaciones.dao.js";

export const consultarActivacionesNotificacionesService = async () => {
    try{
        const usuariosNoti = await consultarActivacionesNotificacionesDao();
        if(usuariosNoti.length === 0){
            const errorInfo = getError(1);
            throw new CustomError(errorInfo);
        }
        
        return usuariosNoti;
    }
    catch(error){
        throw error;
    }
};

export const activarNotificacionesService = async (usuariosNoti) => {
    try{
        const result = await activarNotificacionesDao(usuariosNoti);
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

export const desactivarNotificacionesService = async (usuariosNoti) => {
    try{
        const result = await desactivarNotificacionesDao(usuariosNoti);
        if (result === 0) {
            const error = getError(3);
            throw new CustomError(error);
        }
        return result;
    }
    catch(error){
        throw error;
    }
};

export const gestionarNotificacionServices = async (usuariosNoti) => {
    try{
        const result = await gestionarNotificacionDao(usuariosNoti);
        if (result === 0) {
            const error = getError(3);
            throw new CustomError(error);
        }
        return result;
    }
    catch(error){
        throw error;
    }
};
