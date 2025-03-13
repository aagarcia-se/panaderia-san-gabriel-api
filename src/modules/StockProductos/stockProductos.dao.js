import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarStockProductoDao = async (idProducto) => {
  try {
    const query = `select idStock, idProducto, idSucursal, stock from STOCKPRODUCTOS 
                    where idProducto = ?
                    and estado = 'A';`;
    const stockProducto = await Connection.execute(query, [idProducto]);

    if(stockProducto.rows.length === 0){
        return {
        idStock: 0,
        }
    }

    return stockProducto.rows[0];
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
} 

export const consultarStockProductosDao = async () => {
    try{
        const query = `select sp.idStock, sp.idProducto, p.nombreProducto, p.idCategoria, cat.nombreCategoria,
                        sp.idSucursal, su.nombreSucursal, sp.stock, sp.fechaActualizacion
                        from STOCKPRODUCTOS sp
                        INNER JOIN PRODUCTOS p ON sp.idProducto = p.idProducto
                        INNER JOIN CATEGORIAS cat ON p.idCategoria = cat.idCategoria
                        INNER JOIN SUCURSALES su ON sp.idSucursal = su.idSucursal
                        where sp.estado = 'A'
                        order by idStock asc;`;
    const stockProductos = await Connection.execute(query);
    return stockProductos.rows;
    }catch(error){
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
}

export const registrarStockProductoDao = async (dataStockProducto) => {
  try {
    const query = `INSERT INTO STOCKPRODUCTOS (idProducto, idSucursal, stock, fechaActualizacion, fechaCreacion)
                   VALUES (?, ?, ?, ?, ?);`;
    const stockProducto = await Connection.execute(query, [
        dataStockProducto.idProducto,
        dataStockProducto.idSucursal,
        dataStockProducto.stock,
        dataStockProducto.fechaActualizacion,
        dataStockProducto.fechaCreacion
    ]);

    const stockProductoIngresado = {
        idStock: parseInt(stockProducto.toJSON().lastInsertRowid),
        ...dataStockProducto
    }

    return stockProductoIngresado;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarStockProductoDao = async (dataStockProducto) => {
  try {
    const query = `UPDATE STOCKPRODUCTOS SET stock = ?, fechaActualizacion = ?
                   where idProducto = ?`;
     const resUpdate = await Connection.execute(query, [
        dataStockProducto.stock,
        dataStockProducto.fechaActualizacion,
        dataStockProducto.idProducto
    ]);
    
    return dataStockProducto
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const eliminarStockProductoDao = async (idStock) => {
  try {
    const query = "update STOCKPRODUCTOS set estado = 'N' where idStock = ?;";
    const stockProducto = await Connection.execute(query, [idStock]);
    return stockProducto.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}   