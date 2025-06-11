import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const registrarEliminacionPorDia = async (dataEliminacion) => {
    try {
        const insertEliminacion = `insert into ELIMINACIONESDIARIAS (procesoEliminado, idReferencia, idUsuario, idSucursal, turno, fechaEliminacion)
        values (?, ?, ?, ?, ?, ?);`;
        const eliminacion = await Connection.execute(insertEliminacion, [
            dataEliminacion.procesoEliminado,
            dataEliminacion.idReferencia,
            dataEliminacion.idUsuario,
            dataEliminacion.idSucursal,
            dataEliminacion.turno,
            dataEliminacion.fechaEliminacion
        ]);

        const idEliminacion = eliminacion.toJSON().lastInsertRowid;

        return { idEliminacion, ...dataEliminacion };
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const consultarEliminacionPorDiaDao = async (procesoEliminado, fecha) => {
    try {
        const consulta = `SELECT s.nombreSucursal, DATE(ed.fechaEliminacion) AS fecha, ed.turno,
                            ed.procesoEliminado, COUNT(ed.idEliminacionDiaria) AS cantidadEliminaciones
                            FROM ELIMINACIONESDIARIAS ed
                            JOIN SUCURSALES s ON ed.idSucursal = s.idSucursal
                            WHERE ed.estado = 'A'
                            AND ed.procesoEliminado = ?
                            AND DATE(fechaEliminacion) = ?
                            GROUP BY s.idSucursal, DATE(ed.fechaEliminacion), ed.turno, ed.procesoEliminado
                            ORDER BY fecha DESC, s.nombreSucursal, ed.turno, cantidadEliminaciones DESC;`;
        const eliminacion = await Connection.execute(consulta, [procesoEliminado, fecha]);

        return eliminacion.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};
