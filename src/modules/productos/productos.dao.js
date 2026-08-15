import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const crearProductoDao = async (dataProductos) => {
    try {
        const query =`insert into productos (nombreProducto, idCategoria, controlarStock, controlarStockDiario, controlarInventario, tipoProduccion, fechaCreacion) 
                      values (?, ?, ?, ?, ?, ?, ?);`;

        const resProdcutosInsert = await Connection.execute(query, [
            dataProductos.nombreProducto,
            dataProductos.idCategoria,
            dataProductos.controlarStock,
            dataProductos.controlarStockDiario,
            dataProductos.controlarInventario,
            dataProductos.tipoProduccion,
            dataProductos.fechaCreacion
        ]);
        
        return Number(resProdcutosInsert.toJSON().lastInsertRowid);
      } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
      }
}

export const consultarProductosDao = async () => {
  try {
    // Consulta SQL
    const query = `select idProducto, nombreProducto, idCategoria,  estado from productos;`

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
    const query = `UPDATE PRODUCTOS SET nombreProducto = ?, idCategoria = ?, controlarStock = ?,
                   controlarStockDiario = ?, controlarInventario = ?, tipoProduccion = ?
                   where idProducto = ?`;
    const productos = await Connection.execute(query, [
        dataProducto.nombreProducto,
        dataProducto.idCategoria,
        dataProducto.controlarStock,
        dataProducto.controlarStockDiario,
        dataProducto.controlarInventario,
        dataProducto.tipoProduccion,
        dataProducto.idProducto
    ]);

    return productos.toJSON().rowsAffected;
  } catch (error) {
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
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

// ------------------------------------------------------
// ------------- QUERIES OPTIMIZADAS  ------------------
// ------------------------------------------------------
export const consultarProductosOptimizadoDao = async (idsProductos) => {
    try {
        const placeholders = idsProductos.map(() => '?').join(', ');
        const query = `SELECT idProducto, nombreProducto, idCategoria,
                        controlarStock, controlarStockDiario, tipoProduccion,
                        estado 
                        FROM productos 
                        WHERE idProducto IN (${placeholders})`;

        const productos = await Connection.execute(query, idsProductos);

        return productos.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const constultarProductosParaInventarioDao = async () => {
  try {
    // Consulta SQL
    const query = `SELECT p.idProducto, p.nombreProducto, 
                        p.controlarStock,
                        p.controlarStockDiario,
                        p.controlarInventario,
                        p.tipoProduccion,
  						          conf.unidadesPorBandeja,
                        ca.idCategoria,
                        ca.nombreCategoria, 
                        pr.cantidad, 
                        pr.idPrecio, 
                        pr.precio, 
                        pr.precioPorUnidad,
                        pr.fechaInicio, 
                        pr.fechaFin
                  FROM PRODUCTOS p
                  INNER JOIN PRECIOS pr ON p.idProducto = pr.idProducto
                  INNER JOIN CATEGORIAS ca ON p.idCategoria = ca.idCategoria
  				        LEFT JOIN CONFIGORDEN conf ON p.idProducto = conf.idProducto
                  WHERE 
                  p.controlarInventario = 1
                  AND p.estado = 'A'; -- Solo productos activos`

    // Ejecutar la consulta
    const preciosProductos = await Connection.execute(query);

    // Devolver los registros encontrados
    return preciosProductos.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}
