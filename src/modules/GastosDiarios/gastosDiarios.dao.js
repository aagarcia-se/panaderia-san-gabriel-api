import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


export const ingresarGastosDiariosDao = async (idVenta, gastosDiarios) => {
    const {encabezadoGastosDiarios, detalleGastosDiarios} = gastosDiarios;

    try {
        const scriptInserHeader = `INSERT INTO GASTOSDIARIOS (idVenta, idUsuario, montoTotalGasto, fechaIngreso) 
                                    VALUES (?, ?, ?, ?)`;

        const inserHeader = await Connection.execute(scriptInserHeader, [
            idVenta,
            encabezadoGastosDiarios.idUsuario,
            encabezadoGastosDiarios.montoTotalGasto,
            encabezadoGastosDiarios.fechaIngreso,
        ]);


        const idGastoDiario = inserHeader.toJSON().lastInsertRowid;

        if (!idGastoDiario) {
            return 0;
        }

        const scriptInsertDetalle = `INSERT INTO GASTOSDIARIOSDETALLES (idGastoDiario, detalleGasto, subtotal) 
                                    VALUES (?, ?, ?)`;

        const batchDetalle = detalleGastosDiarios.map((detalle) => ({
            sql: scriptInsertDetalle,
            args: [
                idGastoDiario,
                detalle.detalleGasto,
                detalle.subTotal,
            ]
        }));

        const resBatch = await Connection.batch(batchDetalle);

        return { idGastoDiario, ...gastosDiarios };
        
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }

}
