import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ingresarVentaDao = async (venta) => {
    const {encabezadoVenta, detallesVenta} = venta;
    try {
      // 1. Insertar encabezado
      const ventaInsert = `INSERT INTO VENTAS (idUsuario, idSucursal, fechaVenta, totalVenta, fechaCreacion)
                                VALUES (?, ?, ?, ?, ?);`;
  
      const resVenta = await Connection.execute(ventaInsert, [
        encabezadoVenta.idUsuario,
        encabezadoVenta.idSucursal,
        encabezadoVenta.fechaVenta, 
        encabezadoVenta.totalVenta,
        encabezadoVenta.fechaCreacion
      ]);
      const idVenta = resVenta.toJSON().lastInsertRowid;

      if (!idVenta) {
        return 0;
      }
  
      // 2. Insertar detalles usando el ID generado     
      const ventaDetalleInsert = `INSERT INTO DETALLESVENTAS (idVenta, idProducto, cantidadVendida, precioUnitario, subtotal)
                                  VALUES (?, ?, ?, ?, ?);
                                 `;
  
      const batchDetalleVenta = detallesVenta.map((detalle) => ({
        sql: ventaDetalleInsert,
        args: [
            idVenta,
            detalle.idProducto,
            detalle.cantidadVendida,
            detalle.precioUnitario,
            detalle.subtotal
        ]
      }));
  
      const resBatch = await Connection.batch(batchDetalleVenta);
  
      // Extraer solo los lastInsertRowid de los resultados del batch
      const lastInsertRowids = resBatch.map(result => result.lastInsertRowid);
  
      return venta;
  
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
};

export const consultarVentasPorUsuarioDao = async (idUsuario) => {
  try{

    const consulta = `select v.idVenta, v.idUsuario, concat(u.nombreUsuario, ' ', u.apellidoUsuario)nombreUsuario, v.idSucursal, s.nombreSucursal, 
                      v.fechaVenta, v.totalVenta, v.estadoVenta from ventas v
                      INNER JOIN usuarios u ON v.idUsuario = u.idUsuario
                      INNER JOIN SUCURSALES s ON v.idSucursal = s.idSucursal
                      where 
                        (v.idUsuario = ? OR ? IS NULL OR ? = '')
                        order by v.idVenta desc;`
  
      // Ejecutar la consulta
      const ventasPorUsuario = await Connection.execute(consulta, [idUsuario, idUsuario, idUsuario]);

      // Devolver los registros encontrados
      return ventasPorUsuario.rows;

  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }

}