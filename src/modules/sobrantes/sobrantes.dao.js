import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";



export const ingresarSobranteDao = async (sobrante) => {
    try {
        const script = `INSERT INTO SOBRANTES (idVenta, idProducto, unidadesSobrantes) VALUES (?, ?, ?)`;

        const batch = sobrante.map((sobrante) => {
            return {
                sql: script,
                args: [sobrante.idVenta, sobrante.idProducto, sobrante.unidadesSobrantes]
            }
        });

        const result = await Connection.batch(batch);
        return result;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}
