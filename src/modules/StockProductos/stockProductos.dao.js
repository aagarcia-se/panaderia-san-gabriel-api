import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

/*--------------------------------------------------------------------
----------------- Gestion de la tabla Historial Stock ----------------
----------------------------------------------------------------------*/
export const IngresarHistorialStockDao = async (dataHistorialStock) => {
    try{
        const insert = `insert into HISTORIALSTOCK (idUsuario, idProducto, idSucursal, "INGRESO", cantidad, stockAnterior, stockActual, fechaMovimiento, observaciones, tipoReferencia)
                        values (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        const historialStock = await Connection.execute(insert, [
            dataHistorialStock.idUsuario,
            dataHistorialStock.idProducto,
            dataHistorialStock.idSucursal,
            dataHistorialStock.cantidad,
            dataHistorialStock.stockAnterior,
            dataHistorialStock.stockActual,
            dataHistorialStock.fechaMovimiento,
            dataHistorialStock.observaciones,
            dataHistorialStock.tipoReferencia
        ]);

        const historialStockIngresado = {
            idHistorialStock: parseInt(historialStock.toJSON().lastInsertRowid),
            ...dataHistorialStock
        }
        return historialStockIngresado;

    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const actualizarHistorialStockDao = async (dataHistorialStock) => {
    try{
        const update = `update HISTORIALSTOCK set idProducto = ?, idSucursal = ?, tipoMovimiento = 'CORRECCION', cantidad = ?, stockAnterior = ?, stockActual = ?,
                        fechaMovimiento = ?, observaciones = ?, tipoReferencia = ? 
                        where idHistorialStock = ?;`;
        const historialStock = await Connection.execute(update, [
            dataHistorialStock.idProducto,
            dataHistorialStock.idSucursal,
            dataHistorialStock.cantidad,
            dataHistorialStock.stockAnterior,
            dataHistorialStock.stockActual,
            dataHistorialStock.idHistorialStock,
            dataHistorialStock.fechaMovimiento,
            dataHistorialStock.observaciones,
            dataHistorialStock.tipoReferencia
        ]);

        const historialStockActualizado = {
            idHistorialStock: parseInt(historialStock.toJSON().lastInsertRowid),
            ...dataHistorialStock
        }

        return historialStockActualizado;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const eliminarHistorialStockDao = async (idStock) => {
    try {
      const query = "update HISTORIALSTOCK set estado = 'N' where idHistorial = ?;";
      const stockProducto = await Connection.execute(query, [idStock]);
      return stockProducto.toJSON().rowsAffected;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
}


/*--------------------------------------------------------------------
------------- Gestion de la tabla Stock ------------------------------
----------------------------------------------------------------------*/
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
    const query = `UPDATE STOCKPRODUCTOS SET idProducto = ?, idSucursal = ?,  stock = ?, fechaActualizacion = ?
                   where idProducto = ?`;
                   
     const resUpdate = await Connection.execute(query, [
        dataStockProducto.idProducto,
        dataStockProducto.idSucursal,
        dataStockProducto.stock,
        dataStockProducto.fechaActualizacion,
        dataStockProducto.idProducto
    ]);

    const dataStockProductoUpdate = {
        idStock: parseInt(resUpdate.toJSON().lastInsertRowid),
        ...dataStockProducto
    }

    return dataStockProductoUpdate
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
