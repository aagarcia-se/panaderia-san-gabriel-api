import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const generarReporteHistorialStockDao = async (idProducto, idSucursal) => {
    try {
        const script = `select h.idHistorial, p.nombreProducto, h.tipoMovimiento, h.stockAnterior, h.cantidad,
                        h.stockNuevo, h.fechaMovimiento, h.observaciones, u.nombreUsuario  
                        from HISTORIALSTOCK h
                        inner join PRODUCTOS p ON h.idProducto = p.idProducto
                        inner join USUARIOS u ON h.idUsuario = u.idUsuario
                        where h.idProducto = ?
                        and h.idSucursal = ?;`;

        const params = [
            idProducto,
            idSucursal
        ];

        const result = await Connection.execute(script, params);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};