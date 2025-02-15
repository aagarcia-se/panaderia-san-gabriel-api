import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { consultarConsumosOrdenesProduccionDao, registrarBatchConsumoOrdenProduccionDao } from "./consumosordenes.dao.js";


export const registrarBatchConsumoOrdenProduccionServices = async (consumoOrdenProduccion) => {
    try {
    
        const result = await registrarBatchConsumoOrdenProduccionDao(consumoOrdenProduccion);
    
        if (result === 0) {
          const error = getError(2);
          throw new CustomError(error);
        }
    
        return result;
      } catch (error) {
        throw error;
      }
}

export const consultarConsumosOrdenesProduccionService = async (idOrdenProduccion) => {
    try {
        
        const result = await consultarConsumosOrdenesProduccionDao(idOrdenProduccion);
    
        if (result.length === 0) {
          const error = getError(1);
          throw new CustomError(error);
        }
    
        return result;
      } catch (error) {
        throw error;
      }
}