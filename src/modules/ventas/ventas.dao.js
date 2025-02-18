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