import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ingresarVentaDao = async (ventas) => {
    const {venta, detalleVenta} = ventas;
    
    try {
      // 1. Insertar encabezado
      const ventaInsert = `INSERT INTO VENTAS (idUsuario, idSucursal, fechaVenta, totalVenta, estadoVenta, fechaCreacion)
                                VALUES (?, ?, ?, ?, ?, ?);`;
  
      const resVenta = await Connection.execute(ventaInsert, [
        venta.idUsuario,
        venta.idSucursal,
        venta.fechaVenta, 
        venta.totalVenta,
        venta.estadoVenta,
        venta.fechaCreacion
      ]);
      const idVenta = resVenta.toJSON().lastInsertRowid;
  
      if (!idVenta) {
        return 0;
      }
  
      // 2. Insertar detalles usando el ID generado     
      const ventaDetalleInsert = `INSERT INTO DETALLESVENTAS (idVenta, idProducto, cantidadVendida, precioUnitario, descuento)
                                  VALUES (?, ?, ?, ?, ?);
                                 `;
  
      const batchDetalleVenta = detalleVenta.map((detalle) => ({
        sql: ventaDetalleInsert,
        args: [
            idVenta,
            detalle.idProducto,
            detalle.cantidadVendida,
            detalle.precioUnitario,
            detalle.descuento,
        ]
      }));
  
      const resBatch = await Connection.batch(batchDetalleVenta);
  
      // Extraer solo los lastInsertRowid de los resultados del batch
      const lastInsertRowids = resBatch.map(result => result.lastInsertRowid);
  
      return {
        idVenta: parseInt(idVenta),
        idDetalleVenta: lastInsertRowids.map(id => parseInt(id)) // Convert each ID to a numeric value
      };
  
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
  };