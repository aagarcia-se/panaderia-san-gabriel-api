import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


export const ingresarDescuentoDao = async (stockADescontarData) => {
    try{
        const {descuentoInfo, detalleDescuento} = stockADescontarData;
        
        const insertHeader = `INSERT INTO DESCUENTODESTOCK (idSucursal, descuentoTurno, idUsuario, tipoDescuento, fechaDescuento, fechaCreacion)
                              VALUES (?, ?, ?, ?, ?, ?);`

        const resInsertHeader = await Connection.execute(insertHeader, [
            descuentoInfo.idSucursal,
            descuentoInfo.descuentoTurno || "AM",
            descuentoInfo.idUsuario,
            descuentoInfo.tipoDescuento,
            descuentoInfo.fechaDescuento,
            descuentoInfo.fechaCreacion,
        ]);

        const idDescuento = resInsertHeader.toJSON().lastInsertRowid;

        if (!idDescuento) {
            return 0;
        }

        const insertDetalle = `INSERT INTO DETALLEDESCUENTODESTOCK (idDescuento, idProducto, cantidadUnidades, fechaDescuento)
                               VALUES (?, ?, ?, ?);`;

        const batchDetalle = detalleDescuento.map((detalle) => ({
            sql: insertDetalle,
            args: [
                idDescuento,
                detalle.idProducto,
                detalle.stockADescontar,
                detalle.fechaDescuento,
            ]
        }));

        const resBatch = await Connection.batch(batchDetalle);

        return { idDescuento, ...stockADescontarData };
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }

}

export const consultarDescuentoStockPorSucursalDato = async (idSucursal) => {
    try{
        const consulta = `SELECT des.idDescuento, des.idSucursal, des.descuentoTurno, s.nombreSucursal, des.idUsuario, concat(u.nombreUsuario ,' ' , u.apellidoUsuario) nombreUsuario,
                          des.tipoDescuento, des.fechaDescuento, des.fechaCreacion,  des.estado
                          FROM DESCUENTODESTOCK des 
                          INNER JOIN SUCURSALES s ON des.idSucursal = s.idSucursal 
                          INNER JOIN USUARIOS u ON des.idUsuario = u.idUsuario
                          where des.idSucursal = ?
                          order by des.idDescuento desc;`;
        
        const descuentos = await Connection.execute(consulta, [idSucursal]);

        return descuentos.rows;

    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}
  
export const consultarDescuentoStockPrdocutosDetalle = async (idDescuento) => {
    try{
        const consulta = `SELECT dd.idDescuento, dd.idProducto, p.nombreProducto, dd.cantidadUnidades, dd.fechaDescuento
                          FROM DETALLEDESCUENTODESTOCK dd 
                          INNER JOIN PRODUCTOS p ON dd.idProducto = p.idProducto
                          where dd.idDescuento = ?;`;
        
        const descuentos = await Connection.execute(consulta, [idDescuento]);

        return descuentos.rows;

    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarDescuentoporProductosDao = async (idsProductos, idSucursal, idFecha) => {
    try {
        const placeholders = idsProductos.map(() => "?").join(", ");
        
        const consulta = `SELECT 
                                MIN(dd.idDetalleDescuento) AS idDetalleDescuento, 
                                des.idSucursal,
                                des.descuentoTurno,
                                dd.idProducto,
                                SUM(dd.cantidadUnidades) AS unidadesDescontadas, 
                                DATE(dd.fechaDescuento) AS fechaDescuento
                            FROM DESCUENTODESTOCK des
                            INNER JOIN DETALLEDESCUENTODESTOCK dd ON des.idDescuento = dd.idDescuento
                            WHERE dd.idProducto IN (${placeholders})
                            AND des.idSucursal = ?
                            AND DATE(dd.fechaDescuento) = ?
                            GROUP BY des.idSucursal, dd.idProducto, DATE(dd.fechaDescuento);`;
        
        const descuentos = await Connection.execute(consulta, [
            ...idsProductos,  // expande el array de IDs
            idSucursal,
            idFecha
        ]);

        // Retorna un mapa idProducto → descuento para búsqueda O(1)
        const descuentosMap = new Map(descuentos.rows.map(d => [d.idProducto, d]));

        // Si un producto no tiene descuento, retorna el objeto vacío por defecto
        return {
            getDescuento: (idProducto) => descuentosMap.get(idProducto) ?? { idDescuento: 0 }
        };

    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarDetalleDescuentosDao = async (idDescuento) => {
    try{

        const scriptHeader = `select des.idDescuento, des.idSucursal, des.descuentoTurno, s.nombreSucursal, des.idUsuario, concat(u.nombreUsuario, ' ', u.apellidoUsuario) nombreUsuario, des.tipoDescuento,
                                des.fechaDescuento, des.estado from DESCUENTODESTOCK des
                                inner join SUCURSALES s ON des.idSucursal = s.idSucursal
                                inner join USUARIOS u ON des.idUsuario = u.idUsuario
                                where des.idDescuento = ?;`;
                                  
            const descuentoHeader = await Connection.execute(scriptHeader, [idDescuento]);
        
            if( descuentoHeader.rows.length === 0){
              return 0;
            }
        
            const ScriptDetalle = `select dds.idDetalleDescuento, dds.idProducto, p.nombreProducto, p.controlarStock, p.controlarStockDiario, dds.cantidadUnidades unidadesDescontadas 
                                        from DETALLEDESCUENTODESTOCK dds
                                        inner join PRODUCTOS p ON dds.idProducto = p.idProducto
                                        where idDescuento = ?;`;
        
            const detalleDescuento = await Connection.execute(ScriptDetalle, [idDescuento]);
        
        
            return {
              encabezadoDescuento: descuentoHeader.rows[0],
              detalleDescuento: detalleDescuento.rows
            }

        
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const cancelarDescuentoDeStockDao = async (idDescuento) => {
    try{
        const consulta = `delete from DESCUENTODESTOCK WHERE idDescuento = ?;`;
        
        const descuentos = await Connection.execute(consulta, [idDescuento]);

        return descuentos.rowsAffected === 1 ? Number(idDescuento) : 0 ;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}