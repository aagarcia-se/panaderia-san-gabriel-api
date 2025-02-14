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

export const consultarConsumosOrdenesProduccionDao = async (idOrdenProduccion) => {
    try {
        
      const query = `SELECT 
                      OP.idOrdenProduccion AS OrdenID,
                          OP.fechaAProducir AS FechaProduccion,
                          P.nombreProducto AS Producto,
                          D.cantidadUnidades AS CantidadProducida,
                          I.nombreIngrediente AS Ingrediente,
                          C.cantidadUsada AS CantidadUsada,
                          C.unidadMedida AS UnidadMedida,
                          C.fechaCreacion AS FechaConsumo
                      FROM ORDENESPRODUCCION OP 
                      JOIN DETALLESORDENESPRODUCCION D ON OP.idOrdenProduccion = D.idOrdenProduccion
                      JOIN PRODUCTOS P ON D.idProducto = P.idProducto
                      JOIN CONSUMOSORDENESPRODUCCION C ON D.idDetalleOrdenProduccion = C.idDetalleOrdenProduccion
                      JOIN INGREDIENTES I ON C.idIngrediente = I.idIngrediente
                      WHERE OP.idOrdenProduccion = ? -- Filtra por el ID de la orden de producción
                      and C.cantidadUsada > 0
                      ORDER BY  D.idDetalleOrdenProduccion, OP.idOrdenProduccion, P.nombreProducto, I.nombreIngrediente;`; // Query para consultar los consumos de una orden de producción
  
      const result = await Connection.execute(query, [idOrdenProduccion]);
  
      return result.rows;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);   
    }
}

