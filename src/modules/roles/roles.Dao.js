import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarRolesDao = async () => {
  try {
    // Consulta SQL
    const query = "SELECT idRol, nombreRol, descripcionRol, fechaCreacion, estado  FROM roles WHERE estado = 'A';";

    // Ejecutar la consulta
    const result = await Connection.execute(query);

    // Devolver los registros encontrados
    return result.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const ingresarRolDao = async (dataRol) => {
  try {
    const query =
      "INSERT INTO roles (nombreRol, descripcionRol, fechaCreacion) VALUES (?, ?, ?)";
    const result = await Connection.execute(query, [
      dataRol.nombreRol,
      dataRol.descripcionRol,
      dataRol.fechaCreacion,
    ]);

    return result.toJSON().lastInsertRowid;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const actualizarRolDao = async (dataRol) => {
  try {
    const query =
      "UPDATE roles SET nombreRol = ?, descripcionRol = ? WHERE idRol = ?";
    const result = await Connection.execute(query, [
      dataRol.nombreRol,
      dataRol.descripcionRol,
      dataRol.idRol,
    ]);

    return result.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const eliminarRolDao = async (idRol) => {
  try {
    const query = "DELETE FROM roles WHERE idRol = ?";
    const result = await Connection.execute(query, [idRol]);
    
    return result.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};
