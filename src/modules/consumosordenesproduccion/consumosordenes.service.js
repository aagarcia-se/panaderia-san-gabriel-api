import { registrarBatchConsumoOrdenProduccionDao } from "./consumosordenes.dao.js";


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