import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ingresarCagetoriaDao = async (categoria) => {
  try {
    const query =
      "INSERT INTO categorias (nombreCategoria, descripcionCategoria, fechaCreacion) VALUES (?, ?, ?)";
    const result = await Connection.execute(query, [
      categoria.nombreCategoria,
      categoria.descripcionCategoria,
      categoria.fechaCreacion,
    ]);

    return result.toJSON().lastInsertRowid;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const consultarCategoriasDao = async () => {
  try {
    // Consulta SQL
    const query = `select idCategoria, nombreCategoria, descripcionCategoria, estado from categorias
                   where estado = 'A';`;

    // Ejecutar la consulta
    const result = await Connection.execute(query);

    // Devolver los registros encontrados
    return result.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};
