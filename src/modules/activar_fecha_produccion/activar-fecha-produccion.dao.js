import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarFechasProduccionDao = async (fecha) => {
    try {
        const script = `SELECT 
                            idActivacion,
                            activado_por,
                            activado_en,
                            expira_en,
                            CAST(
                                (strftime('%s', expira_en) - strftime('%s', ?))
                            AS INTEGER) AS segundos_restantes,
                            CASE 
                                WHEN ? < expira_en THEN 'today'
                                ELSE 'tomorrow'
                            END AS fecha_produccion_a_setear
                        FROM activacion_fecha_produccion
                        WHERE expira_en > ?
                        ORDER BY expira_en DESC
                        LIMIT 1;`;
        const result = await Connection.execute(script, [fecha, fecha, fecha]);

        return result.rows;
    } catch (error) {
        console.log(error);
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const ingresarFechaProduccionDao = async (data) => {
    try {
        const script = `INSERT INTO activacion_fecha_produccion (activado_por, activado_en, expira_en, notas)
                        VALUES (?, ?, ?, ?)`;

        const result = await Connection.execute(script, [
            data.activado_por,
            data.activado_en,
            data.expira_en,
            data.notas,
        ]);

        return result.toJSON().lastInsertRowid;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

