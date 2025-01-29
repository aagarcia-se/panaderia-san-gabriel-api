import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


export const consultarPermisosDao = async () => {
  try {
    // Consulta SQL
    const query = `SELECT idPermiso, nombrePermiso, descripcionPermiso, rutaAcceso, fechaCreacion, 
                    estado  FROM permisos WHERE estado = 'A';`;

    // Ejecutar la consulta
    const result = await Connection.execute(query);

    // Devolver los registros encontrados
    return result.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const ingresarPermisoDao = async (dataPermiso) => {
    try {
        const query =
        "INSERT INTO permisos (nombrePermiso, descripcionPermiso, rutaAcceso, fechaCreacion) VALUES (?, ?, ?, ?)";
        const result = await Connection.execute(query, [
        dataPermiso.nombrePermiso,
        dataPermiso.descripcionPermiso,
        dataPermiso.rutaAcceso,
        dataPermiso.fechaCreacion,
        ]);
    
        return result.toJSON().lastInsertRowid;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const actualizarPermisoDao = async (dataPermiso) => {
    try {
        const query =
        `UPDATE permisos SET nombrePermiso = ?, descripcionPermiso = ?, rutaAcceso = ?
         WHERE idPermiso = ?`;
        const result = await Connection.execute(query, [
        dataPermiso.nombrePermiso,
        dataPermiso.descripcionPermiso,
        dataPermiso.rutaAcceso,
        dataPermiso.idPermiso,
        ]);
    
        return result.toJSON().rowsAffected;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const eliminarPermisoDao = async (idPermiso) => {
    try {
        const query = "DELETE FROM permisos WHERE idPermiso = ?";
        const result = await Connection.execute(query, [idPermiso]);
        return result.toJSON().rowsAffected;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}