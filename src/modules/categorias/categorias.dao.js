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

export const actualizarCategoriaDao = async (data) => {
  try {
    const query =
      "update categorias set nombreCategoria = ?, descripcionCategoria = ? where idCategoria = ?";
    const result = await Connection.execute(query, [
      data.nombreCategoria,
      data.descripcionCategoria,
      data.idCategoria,
    ]);
    return result.toJSON().changes > 0;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const eliminarCategoriaDao = async (idCategoria) => {
  try {
    const query = "delete categorias where idCategoria = ?";
    const result = await Connection.execute(query, [idCategoria]);
    return result.toJSON().changes > 0;
  } catch (error) {
    console.log(error.message)
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const consultarCategoriaConProductosDao = async (idCategoria) => {
  try {
    // Consulta SQL
    const query = `select count(*) cantidadProductos from productos 
                    where idCategoria = ?
                    and estado = 'A';`;

    // Ejecutar la consulta
    const result = await Connection.execute(query, [idCategoria]);

    // Devolver los registros encontrados
    return result.rows[0].cantidadProductos;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}