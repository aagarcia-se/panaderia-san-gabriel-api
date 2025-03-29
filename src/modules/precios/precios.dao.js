import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const IngresarPrecioProductoDao = async (dataPrecio) => {
    try {
        const query = `insert into precios (idProducto, cantidad, precio, precioPorUnidad, fechaInicio, fechaFin)
                      values (?, ?, ?, ?, ?, ?);`;

        const resPrecio = await Connection.execute(query, [
            dataPrecio.idProducto,
            dataPrecio.cantidad,
            dataPrecio.precio,
            dataPrecio.precioPorUnidad,
            dataPrecio.fechaInicio,
            dataPrecio.fechaFin || null
        ]);
    
        return resPrecio.toJSON().lastInsertRowid;
      } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
      }
}

export const consultarPreciosProductosDao = async () => {
  try {
    // Consulta SQL
    const query = `SELECT p.idProducto, p.nombreProducto, 
                        p.controlarStock,
                        p.controlarStockDiario,
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
                  WHERE p.estado = 'A'; -- Solo productos activos`

    // Ejecutar la consulta
    const preciosProductos = await Connection.execute(query);

    // Devolver los registros encontrados
    return preciosProductos.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarPrcioProductoDao = async (dataPrecio) => {
  try {
    const query = `update precios set cantidad = ?, precio = ?, precioPorUnidad = ?, fechaInicio = ?, fechaFin = ? 
                    where idProducto = ?;`;
    const precioProducto = await Connection.execute(query, [
        dataPrecio.cantidad,
        dataPrecio.precio,
        dataPrecio.precioPorUnidad,
        dataPrecio.fechaInicio,
        dataPrecio.fechaFin,
        dataPrecio.idProducto,
    ]);

    return precioProducto.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const elimarPrecioProductoDao = async (idProducto) => {
  try {
    const query = "delete from precios where idPrecio = ?;";
    const precioProducto = await Connection.execute(query, [idProducto]);

    return precioProducto.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const consultarPrecioProductoPorIdDao = async (idProducto) => {
  try {
    // Consulta SQL
    const query = `SELECT p.idProducto, p.nombreProducto, ca.nombreCategoria,  pr.precio, pr.precioPorUnidad
                  FROM PRODUCTOS p
                  JOIN PRECIOS pr ON p.idProducto = pr.idProducto
                  JOIN CATEGORIAS ca ON p.idCategoria = ca.idCategoria
                  WHERE p.estado = 'A'
                  and p.idProducto = ?;`

    // Ejecutar la consulta
    const produtco = await Connection.execute(query, [idProducto]);

    // Devolver los registros encontrados
    return produtco.rows[0];
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}