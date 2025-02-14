import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


export const registrarBatchConsumoOrdenProduccionDao = async (consumoOrdenProduccion) => {  
    try {
  
      const insertCosumoIngredientes = `INSERT INTO CONSUMOSORDENESPRODUCCION (idDetalleOrdenProduccion, idIngrediente, cantidadUsada, unidadMedida, fechaCreacion)
                            VALUES (?, ?, ?, ?, ?);
                            `;
  
      const batch = consumoOrdenProduccion.map((detalleConsumo) => ({
        sql: insertCosumoIngredientes,
        args: [
          detalleConsumo.idDetalleOrdenProduccion,
          detalleConsumo.idIngrediente,
          detalleConsumo.cantidadUsada,
          detalleConsumo.unidadMedida,
          detalleConsumo.fechaCreacion
        ]
      }));
  
      const result = await Connection.batch(batch);
      return result.length;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }

}


export const consultarConsumosOrdenesProduccion = async (idOrdenProduccion) => {
    try {
        
      const query = `SELECT * FROM CONSUMOSORDENESPRODUCCION WHERE idOrdenProduccion = ?`;
  
      const result = await Connection.all(query, [idOrdenProduccion]);
  
      return result;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);   
    }
}

