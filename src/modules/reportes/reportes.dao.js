import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const generarReporteHistorialStockDao = async (idProducto, idSucursal, fechaInicio, fechaFin) => {
    try {
        const script = `select h.idHistorial, p.nombreProducto, h.tipoMovimiento, h.stockAnterior, h.cantidad,
                        h.stockNuevo, h.fechaMovimiento, h.observaciones, u.nombreUsuario  
                        from HISTORIALSTOCK h
                        inner join PRODUCTOS p ON h.idProducto = p.idProducto
                        inner join USUARIOS u ON h.idUsuario = u.idUsuario
                        where h.idProducto = ?
                        and h.idSucursal = ?
  						and date(h.fechaMovimiento) between ? and ?
                        order by h.idHistorial asc;
`;

        const params = [
            idProducto,
            idSucursal,
            fechaInicio,
            fechaFin
        ];

        const result = await Connection.execute(script, params);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const generarReporteVentasDao = async (fechaInicio, fechaFin, idSucursal) => {
    try {
        const script = `SELECT 
                        v.idVenta,
                        date(v.fechaVenta) AS fecha_hora_venta, s.nombreSucursal AS sucursal,
                        u.nombreUsuario AS vendedor, v.ventaTurno AS turno, v.totalVenta AS total_venta,
                        COUNT(dv.idDetalleVenta) AS cantidad_productos, SUM(dv.cantidadVendida) AS unidades_vendidas,
                        i.montoTotalIngresado AS efectivo_ingresado, i.montoTotalGastos AS gastos_del_turno,
                        i.montoEsperado AS total_esperado, i.diferencia,
                        CASE 
                            WHEN v.estadoVenta = 'C' THEN 'Completada'
                            WHEN v.estadoVenta = 'P' THEN 'Pendiente'
                            ELSE v.estadoVenta
                        END AS estado_venta
                    FROM VENTAS v
                    JOIN SUCURSALES s ON v.idSucursal = s.idSucursal
                    JOIN USUARIOS u ON v.idUsuario = u.idUsuario
                    LEFT JOIN DETALLESVENTAS dv ON v.idVenta = dv.idVenta
                    LEFT JOIN INGRESOSDIARIOS i ON v.idVenta = i.idVenta AND i.estado = 'A'
                    WHERE v.fechaVenta BETWEEN ? AND ? AND s.idSucursal = ? AND v.estadoVenta = 'C'
                    GROUP BY v.idVenta, v.fechaVenta, s.nombreSucursal, u.nombreUsuario, v.ventaTurno, v.totalVenta, i.montoTotalIngresado, i.montoTotalGastos, i.montoEsperado, i.diferencia, v.estadoVenta
                    ORDER BY v.fechaVenta DESC;`;

        const params = [
            fechaInicio,
            fechaFin,
            idSucursal
        ];

        const result = await Connection.execute(script, params);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const generarReporteDePerdidasDao = async (fechaInicio, fechaFin, idSucursal) => {
    try {
        const script = `SELECT 
                        p.idProducto,
                        p.nombreProducto AS producto,
                        s.nombreSucursal AS sucursal,
                        CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) AS usuario,
                        SUM(dd.cantidadUnidades) AS total_perdido,
                        SUM(dd.cantidadUnidades * pr.precioPorUnidad) AS dineroPerdida,
                        COUNT(DISTINCT DATE(dd.fechaDescuento)) AS dias_con_perdidas
                    FROM DETALLEDESCUENTODESTOCK dd
                    JOIN DESCUENTODESTOCK d ON dd.idDescuento = d.idDescuento
                    JOIN PRODUCTOS p ON dd.idProducto = p.idProducto
                    JOIN SUCURSALES s ON d.idSucursal = s.idSucursal
                    JOIN USUARIOS u ON d.idUsuario = u.idUsuario
                    JOIN PRECIOS pr ON dd.idProducto = pr.idProducto
                    WHERE d.tipoDescuento = 'MAL ESTADO'
                        AND d.idSucursal = ?
                        AND DATE(dd.fechaDescuento) BETWEEN ? AND ?
                        AND d.estado = 'A'
                    GROUP BY 
                        p.idProducto, 
                        p.nombreProducto, 
                        s.nombreSucursal,
                        CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario)
                    ORDER BY total_perdido DESC;`;

        const params = [
            idSucursal,
            fechaInicio,
            fechaFin
        ];

        const result = await Connection.execute(script, params);
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const generarReporteVentasEliminadasDao = async (fechaInicio, fechaFin, idSucursal) => {
    try {
        // Primero obtener las ventas eliminadas
        const scriptVentas = `
             SELECT 
                ve.idEliminacion,
                ve.idVenta,
                concat(u.nombreUsuario, ' ', u.apellidoUsuario)usuario,
                ve.idSucursal,
                ve.turno,
                ve.montoTotalIngresado,
                ve.montoTotalGastos,
                ve.montoEsperado,
                ve.diferencia,
                ve.fechaEliminacion
            FROM VENTASELIMINADAS ve
            INNER JOIN USUARIOS u ON ve.idUsuario = u.idUsuario
            WHERE fechaEliminacion BETWEEN ? AND ?
                AND ve.idSucursal = ?
                AND ve.estado = 'A'
            ORDER BY ve.fechaEliminacion DESC, ve.idEliminacion DESC;
        `;

        const ventasResult = await Connection.execute(scriptVentas, [fechaInicio, fechaFin, idSucursal]);
        
        // Para cada venta, obtener sus detalles
        const ventasConDetalles = [];
        
        for (const venta of ventasResult.rows) {
            const scriptDetalles = `
                SELECT 
                    dv.idProducto,
                    p.nombreProducto,
                    dv.cantidadVendidaEliminada,
                    dv.precioUnitario,
                    dv.descuento,
                    dv.subtotal
                FROM DETALLESVENTASELIMINADAS dv
                INNER JOIN PRODUCTOS p on dv.idProducto = p.idProducto
                WHERE dv.idEliminacion = ?
                ORDER BY dv.idDetalleEliminacion;
            `;
            
            const detallesResult = await Connection.execute(scriptDetalles, [venta.idEliminacion]);
            
            ventasConDetalles.push({
                ...venta,
                ventaEliminadaDetalle: detallesResult.rows
            });
        }

        return ventasConDetalles;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};