import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ConsultarCampaniaActivaDao = async (fechaHoy) => {
    try {
      const query = `SELECT idCampania, nombreCampania, descripcion, fechaInicio, fechaFin FROM campanias 
                      WHERE ? BETWEEN fechaInicio AND fechaFin
                      AND estado = 'A';`;
      const result = await Connection.execute(query, [fechaHoy]);

      if (result.rows.length === 0) {
        return 0;
      }
  
      return result.rows;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
}

