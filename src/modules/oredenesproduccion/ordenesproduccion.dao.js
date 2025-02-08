import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarDetalleOrdenProduccionDao = async () => {
    try {
      // Consulta SQL
      const query = `SELECT op.idOrdenProduccion, op.idSUcursal, op.nombrepanadero, op.fechaAProducir, op.estadoOrden,
                        (
                            SELECT COUNT(*) 
                            FROM DETALLESORDENESPRODUCCION AS dp 
                            WHERE dp.idOrdenProduccion = op.idOrdenProduccion
                            ) AS cantidadProductos
                        FROM ORDENESPRODUCCION AS op
                        order by op.idOrdenProduccion desc;`;

      // Ejecutar la consulta
      const ordenesProduccion = await Connection.execute(query);

      // Devolver los registros encontrados
      return ordenesProduccion.rows;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
}
