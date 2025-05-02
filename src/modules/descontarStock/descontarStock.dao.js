import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


export const ingresarDescuentoDao = async (stockADescontarData) => {
    try{
        const {descuentoInfo, detalleDescuento} = stockADescontarData;
        
        const insertHeader = `INSERT INTO DESCUENTODESTOCK (idSucursal, idUsuario, tipoDescuento, fechaDescuento, fechaCreacion)
                              VALUES (?, ?, ?, ?, ?);`

        const resInsertHeader = await Connection.execute(insertHeader, [
            descuentoInfo.idSucursal,
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
        const consulta = `SELECT des.idDescuento, des.idSucursal, s.nombreSucursal, des.idUsuario, concat(u.nombreUsuario ,' ' , u.apellidoUsuario) nombreUsuario,
                          des.tipoDescuento, des.fechaDescuento, des.fechaCreacion,  des.estado
                          FROM DESCUENTODESTOCK des 
                          INNER JOIN SUCURSALES s ON des.idSucursal = s.idSucursal 
                          INNER JOIN USUARIOS u ON des.idUsuario = u.idUsuario
                          where des.idSucursal = ?;`;
        
        const descuentos = await Connection.execute(consulta, [idSucursal]);

        return descuentos.rows;

    }catch(error){
        console.log(error);
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}
    


