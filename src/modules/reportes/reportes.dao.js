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
        const script = `select d.idDescuento, CONCAT(u.nombreUsuario, ' ', u.apellidoUsuario) as usuario, s.nombreSucursal as sucursal, 
                        d.descuentoTurno as turno, d.fechaDescuento,
                        dd.idProducto, p.nombreProducto, dd.cantidadUnidades as unidadesPerdidas, 
                        (dd.cantidadUnidades * pr.precioPorUnidad) AS dineroPerdida
                        from descuentodestock d
                        join detalledescuentodestock dd on d.idDescuento = dd.idDescuento
                        join productos p on dd.idProducto = p.idProducto
                        join sucursales s on d.idSUcursal = s.idSucursal
                        join usuarios u on d.idUsuario = u.idUsuario
                        join precios pr on dd.idProducto = pr.idProducto
                        where d.tipoDescuento = 'MAL ESTADO'
                        and d.idSucursal = ?
                        and date(d.fechaDescuento) between ? and ?;`;

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

export const generarReporteBalanceStokDao = async (fecha, idSucursal, turno) => {
    try {

        const script = `
               WITH params AS (SELECT ? AS turnoFiltro),
                produccion AS (
                    SELECT 
                        do.idProducto,
                        do.cantidadUnidades AS unidadesProducidas,
                        op.ordenTurno
                    FROM DETALLESORDENESPRODUCCION do
                    INNER JOIN ORDENESPRODUCCION op 
                        ON op.idOrdenProduccion = do.idOrdenProduccion
                    WHERE op.fechaAproducir = ?
                        AND op.idSucursal = ?
                ),
                historial_stock AS (
                    SELECT 
                        h.idProducto,
                        h.cantidad,
                        h.fechaMovimiento,
                        CASE 
                            WHEN (ROW_NUMBER() OVER (PARTITION BY h.idProducto ORDER BY h.fechaMovimiento ASC)) = 1 THEN 'AM'
                            ELSE 'PM'
                        END AS turno_historial
                    FROM HISTORIALSTOCK h
                    INNER JOIN PRODUCTOS p ON h.idProducto = p.idProducto
                    WHERE h.tipoReferencia = 'CONTROL DE STOCK'
                        AND DATE(h.fechaMovimiento) = ?
                        AND h.idSucursal = ?
                ),
                stock_existente AS (
                    SELECT 
                        h.idProducto,
                        h.stockNuevo AS unidadesExistentes,
                        h.fechaMovimiento
                    FROM HISTORIALSTOCK h
                    INNER JOIN PRODUCTOS p ON h.idProducto = p.idProducto
                    WHERE h.idSucursal = ?
                    ORDER BY h.idHistorial DESC
                ),
                produccion_con_historial AS (
                    SELECT 
                        p.idProducto,
                        p.ordenTurno,
                        CASE 
                            WHEN p.unidadesProducidas = 0 THEN 
                                COALESCE(
                                    (SELECT hs.cantidad 
                                    FROM historial_stock hs 
                                    WHERE hs.idProducto = p.idProducto 
                                    AND hs.turno_historial = p.ordenTurno
                                    LIMIT 1),
                                    (SELECT se.unidadesExistentes
                                    FROM stock_existente se
                                    WHERE se.idProducto = p.idProducto
                                    LIMIT 1),
                                    0
                                )
                            ELSE p.unidadesProducidas
                        END AS unidadesProducidas
                    FROM produccion p
                ),
                ventasR AS (
                    SELECT
                        dv.idProducto,
                        dv.cantidadVendida AS unidadesVendidas,
                        v.ventaTurno
                    FROM DETALLESVENTAS dv
                    INNER JOIN VENTAS v 
                        ON v.idVenta = dv.idVenta
                    WHERE v.fechaCreacion = ?
                        AND v.idSucursal = ?
                ),
                descuentos AS (
                    SELECT 
                        ds.idProducto,
                        ds.cantidadUnidades AS unidadesDescontadas,
                        d.descuentoTurno
                    FROM DETALLEDESCUENTODESTOCK ds
                    INNER JOIN DESCUENTODESTOCK d 
                        ON d.idDescuento = ds.idDescuento
                    WHERE DATE(d.fechaDescuento) = ?
                        AND d.idSucursal = ?
                ),
                base AS (
                    SELECT 
                        ph.idProducto,
                        pr.nombreProducto,
                        ph.ordenTurno AS turno,
                        ph.unidadesProducidas,
                        COALESCE(v.unidadesVendidas, 0) AS unidadesVendidas,
                        COALESCE(d.unidadesDescontadas, 0) AS unidadesDescontadas,
                        (ph.unidadesProducidas - COALESCE(v.unidadesVendidas, 0) - COALESCE(d.unidadesDescontadas, 0)) AS stockDisponible
                    FROM produccion_con_historial ph
                    LEFT JOIN ventasR v 
                        ON v.idProducto = ph.idProducto 
                        AND v.ventaTurno = ph.ordenTurno
                    LEFT JOIN descuentos d 
                        ON d.idProducto = ph.idProducto 
                        AND d.descuentoTurno = ph.ordenTurno
                    INNER JOIN PRODUCTOS pr 
                        ON pr.idProducto = ph.idProducto
                    WHERE pr.idCategoria = 1
                    and pr.tipoProduccion = 'bandejas'
                )
                SELECT 
                    b.idProducto,
                    b.nombreProducto,
                    CASE WHEN p.turnoFiltro = '' THEN 'TODOS' ELSE b.turno END AS turno,
                    SUM(b.unidadesProducidas) AS unidadesProducidas,
                    SUM(b.unidadesVendidas) AS unidadesVendidas,
                    SUM(b.unidadesDescontadas) AS unidadesDescontadas,
                    SUM(b.stockDisponible) AS stockDisponible
                FROM base b
                CROSS JOIN params p
                WHERE (p.turnoFiltro = '' OR b.turno = p.turnoFiltro)
                    AND b.idProducto != 42
                GROUP BY b.idProducto, b.nombreProducto, CASE WHEN p.turnoFiltro = '' THEN 'TODOS' ELSE b.turno END
                ORDER BY b.idProducto ASC, b.turno ASC;
        `;

        const params = [
            turno,
            fecha,
            idSucursal,
            fecha,
            idSucursal,
            idSucursal,
            fecha,
            idSucursal,
            fecha,
            idSucursal
        ];

        const result = await Connection.execute(script, params);
        return result.rows;
        
    } catch (error) {
        console.log(error);
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const generarReporteSobrantesDao = async (fecha, idSucursal) => {
    try {
        // Primero obtener las ventas eliminadas
        const scriptVentas = `
                                select v.idVenta, s.nombreSucursal, concat(u.nombreUsuario, ' ',u.apellidoUsuario)usuario,
                                v.ventaTurno, v.fechaVenta
                                from ventas v
                                inner join usuarios u on v.idUsuario = u.idUsuario
                                inner join sucursales s on v.idSucursal = s.idSucursal
                                where v.fechaVenta = ?
                                and v.idSucursal = ?;
        `;

        const ventasResult = await Connection.execute(scriptVentas, [fecha, idSucursal]);
        
        // Para cada venta, obtener sus detalles
        const ventasConDetalles = [];
        
        for (const venta of ventasResult.rows) {
            const scriptDetalles = `
                                select s.idSobrante, s.idProducto, p.nombreProducto, s.unidadesSobrantes
                                from SOBRANTES s
                                inner join PRODUCTOS p on s.idProducto = p.idProducto
                                where s.idVenta = ?;
            `;
            
            const detallesResult = await Connection.execute(scriptDetalles, [venta.idVenta]);
            
            if (detallesResult.rows.length === 0) {
                ventasConDetalles.push({
                    ...venta,
                    ventaDetalle: []
                });
                continue;
            }
        }

        return ventasConDetalles;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};