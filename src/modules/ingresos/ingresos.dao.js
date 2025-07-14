import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const registrarIngresosDiariosPorTurnoDao = async (dataIngesos) =>{
    try{
        const insertIngreso = `INSERT INTO INGRESOSDIARIOS (idVenta, montoTotalIngresado, montoTotalGastos, montoEsperado, diferencia, fechaIngreso)
                            VALUES (?, ?, ?, ?, ?, ?);`

       const resInsert = await Connection.execute(insertIngreso, [
        dataIngesos.idVenta,
        dataIngesos.montoTotalIngresado,
        dataIngesos.montoTotalGastos || 0,
        dataIngesos.montoEsperado,
        dataIngesos.diferencia,
        dataIngesos.fechaIngreso,
       ])

       const idIngreso = resInsert.toJSON().lastInsertRowid;

       return idIngreso;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarIngresosMensualesDao = async () => {
    try {
        const query = `SELECT 
                                s.idSucursal,
                                s.nombreSucursal,
                                SUM(i.montoTotalIngresado) AS ingresoMensual
                            FROM 
                                INGRESOSDIARIOS i
                            JOIN 
                                VENTAS v ON i.idVenta = v.idVenta
                            JOIN 
                                SUCURSALES s ON v.idSucursal = s.idSucursal
                            WHERE 
                                strftime('%m', i.fechaIngreso) = strftime('%m', 'now')  -- Mes actual
                                AND strftime('%Y', i.fechaIngreso) = strftime('%Y', 'now')  -- Año actual
                                AND i.estado = 'A'  -- Solo registros activos
                                AND v.estadoVenta = 'C'  -- Solo ventas completadas
                            GROUP BY 
                                s.idSucursal, 
                                s.nombreSucursal
                            ORDER BY 
                                ingresoMensual DESC;`;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarIngresosAnualesDao = async () => {
    try {
        const query = `SELECT 
                                s.idSucursal,
                                s.nombreSucursal,
                                SUM(i.montoTotalIngresado) AS ingresoAnual
                            FROM 
                                INGRESOSDIARIOS i
                            JOIN 
                                VENTAS v ON i.idVenta = v.idVenta
                            JOIN 
                                SUCURSALES s ON v.idSucursal = s.idSucursal
                            WHERE 
                                strftime('%Y', i.fechaIngreso) = strftime('%Y', 'now')  -- Año actual
                                AND i.estado = 'A'  -- Solo registros activos
                                AND v.estadoVenta = 'C'  -- Solo ventas completadas
                            GROUP BY 
                                s.idSucursal, 
                                s.nombreSucursal
                            ORDER BY 
                                ingresoAnual DESC;`;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarResumenIngresosPorMesDao = async () => {
    try {
        const query = `WITH meses_anio AS (
                        SELECT '01' AS mes_num, 'ene' AS mes_nom UNION ALL
                        SELECT '02', 'feb' UNION ALL
                        SELECT '03', 'mar' UNION ALL
                        SELECT '04', 'abr' UNION ALL
                        SELECT '05', 'may' UNION ALL
                        SELECT '06', 'jun' UNION ALL
                        SELECT '07', 'jul' UNION ALL
                        SELECT '08', 'ago' UNION ALL
                        SELECT '09', 'sep' UNION ALL
                        SELECT '10', 'oct' UNION ALL
                        SELECT '11', 'nov' UNION ALL
                        SELECT '12', 'dic'
                    ),
                    ingresos_mes AS (
                        SELECT 
                            strftime('%m', fechaIngreso) AS mes_num,
                            SUM(montoTotalIngresado) AS total_ingresos
                        FROM 
                            INGRESOSDIARIOS
                        WHERE 
                            strftime('%Y', fechaIngreso) = strftime('%Y', 'now')
                            AND estado = 'A'
                        GROUP BY 
                            mes_num
                    )
                    SELECT 
                        m.mes_nom AS mes,
                        COALESCE(i.total_ingresos, 0) AS total_ingresos
                    FROM 
                        meses_anio m
                    LEFT JOIN 
                        ingresos_mes i ON m.mes_num = i.mes_num
                    WHERE 
                        m.mes_num <= strftime('%m', 'now')  -- Solo hasta el mes actual
                    ORDER BY 
                        m.mes_num;`;
        const result = await Connection.execute(query);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}
