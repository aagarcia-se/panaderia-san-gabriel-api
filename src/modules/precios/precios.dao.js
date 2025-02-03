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
            dataPrecio.fechaFin
        ]);
    
        return resPrecio.toJSON().lastInsertRowid;
      } catch (error) {
        console.log(error)
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
      }
}

export const consultarPreciosProductosDao = async () => {
  try {
    // Consulta SQL
    const query = `SELECT p.idProducto, 
                        p.nombreProducto, 
                        ca.nombreCategoria, 
                        pr.cantidad, 
                        pr.idPrecio, 
                        pr.precio, 
                        pr.precioPorUnidad,
                        pr.fechaInicio, 
                        pr.fechaFin, 
                        img.imagenB64
                  FROM PRODUCTOS p
                  JOIN PRECIOS pr ON p.idProducto = pr.idProducto
                  JOIN CATEGORIAS ca ON p.idCategoria = ca.idCategoria
                  LEFT JOIN PRODUCTOSIMAGENES img ON p.idProducto = img.idProducto -- LEFT JOIN para incluir productos sin imagen
                  WHERE p.estado = 'A' -- Solo productos activos
                  AND (pr.fechaFin IS NULL OR pr.fechaFin >= CURRENT_TIMESTAMP);-- Precios vigentes`

    // Ejecutar la consulta
    const preciosProductos = await Connection.execute(query);

    // Devolver los registros encontrados
    return preciosProductos.rows;
  } catch (error) {
    console.log(error)
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