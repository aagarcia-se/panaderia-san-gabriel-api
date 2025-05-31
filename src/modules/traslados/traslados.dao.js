
import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

/*--------------------------------------------------------------------
----------------- Gestion de la tabla Traslados Productos ------------
----------------------------------------------------------------------*/
export const registrarTrasladoProductoDao = async (trasladoProducto) => {
    const {traladoHeader, trasladoDetalle} = trasladoProducto;
    try {
        const insertTrasladoHeader = `insert into TRASLADOSPRODUCTOS (idSucursalOrigen, idSucursalDestino, idUsuario, fechaTraslado)
        values (?, ?, ?, ?);`;
        const trasladoHeader = await Connection.execute(insertTrasladoHeader, [
            traladoHeader.idSucursalOrigen,
            traladoHeader.idSucursalDestino,
            traladoHeader.idUsuario,
            traladoHeader.fechaTraslado
        ]);

        const idTraslado = trasladoHeader.toJSON().lastInsertRowid;

        if (!idTraslado) {
            return 0;
        }

        const insertTrasladoDetalle = `insert into TRASLADOSPRODUCTOSDETALLES (idTraslado, idProducto, cantidadATrasladar)
        values (?, ?, ?);`;

        const batchDetalle = trasladoDetalle.map((detalle) => ({
            sql: insertTrasladoDetalle,
            args: [
                idTraslado,
                detalle.idProducto,
                detalle.cantidadATrasladar
            ]
        }));

        const resBatch = await Connection.batch(batchDetalle);

        return {
            idTraslado,
            ...traladoHeader
        }

    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const consultarTrasladosDao = async () => {
    try {
        const query = `SELECT tp.idTraslado, so.nombreSucursal AS sucursalOrigen,
                        sd.nombreSucursal AS sucursalDestino, concat(u.nombreUsuario, ' ', u.apellidoUsuario) AS usuarioResponsable,
                        tp.fechaTraslado
                        FROM TRASLADOSPRODUCTOS tp INNER JOIN SUCURSALES so ON tp.idSucursalOrigen = so.idSucursal
                        INNER JOIN SUCURSALES sd ON tp.idSucursalDestino = sd.idSucursal INNER JOIN USUARIOS u ON tp.idUsuario = u.idUsuario
                        AND tp.estado = 'A'
                        ORDER BY tp.idTraslado DESC;`;

        const result = await Connection.execute(query);

        if(result.rows.length === 0){
            return 0;
        }

        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarDetalleDeTraladoDao = async (idTraslado) => {
    try {
        const query = `SELECT tp.idTraslado, so.nombreSucursal AS sucursalOrigen,
                        sd.nombreSucursal AS sucursalDestino, concat(u.nombreUsuario, ' ', u.apellidoUsuario) AS usuarioResponsable,
                        tp.fechaTraslado
                        FROM TRASLADOSPRODUCTOS tp 
                        INNER JOIN SUCURSALES so ON tp.idSucursalOrigen = so.idSucursal
                        INNER JOIN SUCURSALES sd ON tp.idSucursalDestino = sd.idSucursal 
                        INNER JOIN USUARIOS u ON tp.idUsuario = u.idUsuario
                        where tp.idTraslado = ?
                        ORDER BY tp.fechaTraslado DESC;`;

        const result = await Connection.execute(query, [idTraslado]);

        if(result.rows.length === 0){
            return 0;
        }

        const queryDetalle = `select td.idTrasladoDetalle, td.idProducto, p.nombreProducto, td.cantidadATrasladar 
                                from TRASLADOSPRODUCTOSDETALLES td
                                inner join productos p on td.idProducto = p.idProducto
                                where td.idTraslado = ?;`;

        const resultDetalle = await Connection.execute(queryDetalle, [idTraslado]);

        return {
            encabezadoTraslado: result.rows[0],
            detalle: resultDetalle.rows
        };
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const eliminarTrasladoDao = async (idTraslado) => {
    try {
        const query = `delete from TRASLADOSPRODUCTOS where idTraslado = ?;`;
        const result = await Connection.execute(query, [idTraslado]);

        if(result.rowsAffected === 0){
            return 0;
        }else{
            return Number(idTraslado);
        }

    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}