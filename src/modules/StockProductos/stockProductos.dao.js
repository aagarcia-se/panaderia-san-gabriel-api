import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

/*--------------------------------------------------------------------
----------------- Gestion de la tabla Historial Stock ----------------
----------------------------------------------------------------------*/
export const IngresarHistorialStockDao = async (dataHistorialStock) => {
    try{
        const insert = `insert into HISTORIALSTOCK (idUsuario, idProducto, idSucursal, tipoMovimiento, stockAnterior, stockNuevo, cantidad, fechaMovimiento, observaciones, tipoReferencia)
        values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
            const historialStock = await Connection.execute(insert, [
            dataHistorialStock.idUsuario,
            dataHistorialStock.idProducto,
            dataHistorialStock.idSucursal,
            dataHistorialStock.tipoMovimiento || 'INGRESO',
            dataHistorialStock.stockAnterior,
            dataHistorialStock.stockNuevo,
            dataHistorialStock.cantidad,
            dataHistorialStock.fechaActualizacion,
            dataHistorialStock.observaciones || "Ingreso Manual",
            dataHistorialStock.tipoReferencia || "CONTROL DE STOCK"
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
export const consultarStockProductoDao = async (idProducto, idSucursal) => {
  try {
    const query = `select idStock, idProducto, idSucursal, stock from STOCKPRODUCTOS 
                    where idProducto = ?
                    and idSucursal = ?
                    and estado = 'A';`;
    const stockProducto = await Connection.execute(query, [idProducto, idSucursal]);

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

export const consultarStockProductosDao = async (idSucursal) => {
    try{
        const query = `select sp.idStock, sp.idProducto, p.nombreProducto, p.idCategoria, cat.nombreCategoria,
                        sp.idSucursal, su.nombreSucursal, sp.stock as cantidadExistente, sp.fechaActualizacion
                        from STOCKPRODUCTOS sp
                        INNER JOIN PRODUCTOS p ON sp.idProducto = p.idProducto
                        INNER JOIN CATEGORIAS cat ON p.idCategoria = cat.idCategoria
                        INNER JOIN SUCURSALES su ON sp.idSucursal = su.idSucursal
                        where sp.idSucursal = ?
                        and sp.estado = 'A'
                        order by sp.stock desc;`;
    const stockProductos = await Connection.execute(query, [idSucursal]);
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
                   where idProducto = ?
                   and idSucursal = ?`
                   ;
                   
     const resUpdate = await Connection.execute(query, [
        dataStockProducto.stock,
        dataStockProducto.fechaActualizacion,
        dataStockProducto.idProducto,
        dataStockProducto.idSucursal,
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

/*--------------------------------------------------------------------
--------- Gestion de la tabla Stock Productos Diarios-----------------
----------------------------------------------------------------------*/
export const consultarStockProductoDiarioDao = async (idProducto, idSucursal, fechaValidez) => {
  try {
    const query = `select idStockDiario, idProducto, idSucursal, stock, fechaValidez from STOCKPRODUCTOSDIARIOS
                    where idProducto = ?
                    and idSucursal = ?
                    and fechaValidez = ?
                    and estado = 'A';`;
    const stockProductoDiario = await Connection.execute(query, 
      [idProducto,
       idSucursal,
       fechaValidez]);

    if(stockProductoDiario.rows.length === 0){
        return {
        idStockDiario: 0,
        }
    }

    return stockProductoDiario.rows[0];
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const registrarStockProductoDiarioDao = async (dataStockProductoDiario) => {
  try {
    const query = `INSERT INTO STOCKPRODUCTOSDIARIOS (idProducto, idSucursal, stock, fechaValidez, fechaActualizacion, fechaCreacion)
                   VALUES (?, ?, ?, ?, ?, ?);`;
    const stockProducto = await Connection.execute(query, [
      dataStockProductoDiario.idProducto,
      dataStockProductoDiario.idSucursal,
      dataStockProductoDiario.stock,
      dataStockProductoDiario.fechaValidez,
      dataStockProductoDiario.fechaActualizacion,
      dataStockProductoDiario.fechaCreacion
    ]);

    const stockProductoDiarioIngresado = {
        idStock: parseInt(stockProducto.toJSON().lastInsertRowid),
        ...dataStockProductoDiario
    }

    return stockProductoDiarioIngresado;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarStockProductoDiarioDao = async (dataStockProductoDiario) => {
  try {
    const query = `UPDATE STOCKPRODUCTOSDIARIOS SET stock = ?, fechaActualizacion = ?
                   where idProducto = ?
                   and idSucursal = ?
                   and fechaValidez = ?`;
                   
     const resUpdate = await Connection.execute(query, [
      dataStockProductoDiario.stock,
      dataStockProductoDiario.fechaActualizacion,
      dataStockProductoDiario.idProducto,
      dataStockProductoDiario.idSucursal,
      dataStockProductoDiario.fechaValidez,
    ]);

    const dataStockProductoDiarioUpdate = {
        idStock: parseInt(resUpdate.toJSON().lastInsertRowid),
        ...dataStockProductoDiario
    }

    return dataStockProductoDiarioUpdate
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const eliminarStockProductoDiarioDao = async (idStockDiario) => {
  try {
    const query = "update STOCKPRODUCTOSDIARIOS set estado = 'N' where idStockDiario = ?;";
    const stockProductoDiario = await Connection.execute(query, [idStockDiario]);
    return stockProductoDiario.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

//Consultar para obtener todos los datos del hisotrial
export const consultarStockDiarioPorSucursalDao = async (idSucursal, fecha) => {
  try {
    const query = `select std.idStockDiario, std.idProducto, p.nombreProducto, P.idCategoria, c.nombreCategoria,
                    std.idSucursal, s.nombreSucursal,
                    std.stock as cantidadExistente, std.fechaValidez
                    from STOCKPRODUCTOSDIARIOS std
                    inner join PRODUCTOS p ON std.idProducto = p.idProducto
                    inner join SUCURSALES s ON std.idSucursal = s.idSucursal
                    inner join CATEGORIAS c ON p.idCategoria = c.idCategoria
                    where std.idSucursal = ?
                    and std.fechaValidez = ?
                    and std.estado = 'A'
                    order by std.idProducto asc;`;
    const productosExistentes = await Connection.execute(query, [
      idSucursal, 
      fecha
    ]);

    if(productosExistentes.rows.length === 0){
        return {
        idStockDiario: 0,
        }
    }

    return productosExistentes.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}