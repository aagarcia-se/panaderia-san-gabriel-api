import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const registrarEliminacionPorDia = async (dataEliminacion) => {
    try {
        const insertEliminacion = `insert into ELIMINACIONESDIARIAS (procesoEliminado, idReferencia, idUsuario, idSucursal, turno, fechaEliminacion)
        values (?, ?, ?, ?, ?, ?);`;
        const eliminacion = await Connection.execute(insertEliminacion, [
            dataEliminacion.procesoEliminado,
            dataEliminacion.idReferencia,
            dataEliminacion.idUsuario,
            dataEliminacion.idSucursal,
            dataEliminacion.turno,
            dataEliminacion.fechaEliminacion
        ]);

        const idEliminacion = eliminacion.toJSON().lastInsertRowid;

        return { idEliminacion, ...dataEliminacion };
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const registrarVentaEliminadaDao = async (dataEliminada) => {
    
    const {encabezadoVetaEliminada, detalleVentaEliminada, ingresosVentaEliminada} = dataEliminada;
    
    const scriptInsertHeader = `INSERT INTO VENTASELIMINADAS(idVenta, idUsuario, idSucursal, turno, montoTotalIngresado, montoTotalGastos, montoEsperado, diferencia, fechaEliminacion)
                                VALUES 
                                (?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    try {
        const restInsertHeader = await Connection.execute(scriptInsertHeader, [
            encabezadoVetaEliminada.idVenta,
            encabezadoVetaEliminada.idUsuario, 
            encabezadoVetaEliminada.idSucursal,
            encabezadoVetaEliminada.turno,
            ingresosVentaEliminada.montoTotalIngresado, 
            ingresosVentaEliminada.montoTotalGastos || 0, // Valor por defecto si es null
            ingresosVentaEliminada.montoEsperado || 0,    // Valor por defecto si es null
            ingresosVentaEliminada.diferencia || 0,       // Valor por defecto si es null
            encabezadoVetaEliminada.fechaEliminacion
        ]);

        const idEliminacion = restInsertHeader.toJSON().lastInsertRowid;

        if(!idEliminacion){
            return 0;
        }

        const scriptInsert = `INSERT INTO detallesventaseliminadas (idEliminacion, idProducto, cantidadVendidaEliminada, precioUnitario, subtotal)
                              VALUES (?, ?, ?, ?, ?)`;

        // Corregir el mapeo - usar idEliminacion en lugar de idEliminacionDiaria
        const batchDetalleVentaEliminada = detalleVentaEliminada.map((detalle) => ({
            sql: scriptInsert,
            args: [
                idEliminacion, // Este es el ID correcto
                detalle.idProducto, // idProducto en lugar de idEliminacionDiaria
                detalle.cantidadVendidaEliminada,
                detalle.precioUnitario,
                detalle.subtotal
            ]
        }));

        const restBatch = await Connection.batch(batchDetalleVentaEliminada);

        return {idEliminacion, ...dataEliminada}; // Corregir nombre de variable

    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarEliminacionPorDiaDao = async (procesoEliminado, fecha) => {
    try {
        const consulta = `SELECT s.nombreSucursal, DATE(ed.fechaEliminacion) AS fecha, ed.turno,
                            ed.procesoEliminado, COUNT(ed.idEliminacionDiaria) AS cantidadEliminaciones
                            FROM ELIMINACIONESDIARIAS ed
                            JOIN SUCURSALES s ON ed.idSucursal = s.idSucursal
                            WHERE ed.estado = 'A'
                            AND ed.procesoEliminado = ?
                            AND DATE(fechaEliminacion) = ?
                            GROUP BY s.idSucursal, DATE(ed.fechaEliminacion), ed.turno, ed.procesoEliminado
                            ORDER BY fecha DESC, s.nombreSucursal, ed.turno, cantidadEliminaciones DESC;`;
        const eliminacion = await Connection.execute(consulta, [procesoEliminado, fecha]);

        return eliminacion.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};
