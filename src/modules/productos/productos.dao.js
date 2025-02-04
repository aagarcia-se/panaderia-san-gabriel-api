import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const crearProductoDao = async (dataProductos) => {
    try {
        const query =`insert into productos (nombreProducto, idCategoria, fechaCreacion) values 
                      (?, ?, ?);`;

        const resProdcutosInsert = await Connection.execute(query, [
            dataProductos.nombreProducto,
            dataProductos.idCategoria,
            dataProductos.fechaCreacion
        ]);
    
        return resProdcutosInsert.toJSON().lastInsertRowid;
      } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
      }
}

export const consultarProductosDao = async () => {
  try {
    // Consulta SQL
    const query = `select idProducto, nombreProducto, idCategoria, estado from productos;`

    // Ejecutar la consulta
    const productos = await Connection.execute(query);

    // Devolver los registros encontrados
    return productos.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarProductoDao = async (dataProducto) => {
  try {
    const query = `UPDATE PRODUCTOS SET nombreProducto = ?, idCategoria = ? 
                  where idProducto = ?`;
    const productos = await Connection.execute(query, [
        dataProducto.nombreProducto,
        dataProducto.idCategoria,
        dataProducto.idProducto
    ]);

    return productos.toJSON().rowsAffected;
  } catch (error) {
    console.log(error)
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const eliminarProductoDao = async (idProducto) => {
  try {
    const query = "delete from productos where idProducto = ?;";
    const producto = await Connection.execute(query, [idProducto]);

    return producto.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const desactivarProductoDao = async (idProducto) => {
  try {
    const query = "update productos set estado = 'N' where idProducto = ?;";
    const producto = await Connection.execute(query, [idProducto]);

    return producto.toJSON().rowsAffected;
  } catch (error) {
    console.log(error)
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}