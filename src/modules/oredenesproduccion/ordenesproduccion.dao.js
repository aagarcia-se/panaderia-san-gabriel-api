import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarOrdenProduccionDao = async () => {
    try {
      // Consulta SQL
      const query = `SELECT op.idOrdenProduccion, op.idSucursal, op.ordenTurno, s.nombresucursal, op.nombrepanadero, 
                        op.fechaAProducir, op.estadoOrden,
                        (
                            SELECT COUNT(*) 
                            FROM DETALLESORDENESPRODUCCION AS dp 
                            WHERE dp.idOrdenProduccion = op.idOrdenProduccion
                        ) AS cantidadProductos
                    FROM ORDENESPRODUCCION AS op
                    INNER JOIN SUCURSALES AS s ON op.idSucursal = s.idSucursal
                    ORDER BY op.idOrdenProduccion DESC;`;

      // Ejecutar la consulta
      const ordenesProduccion = await Connection.execute(query);

      // Devolver los registros encontrados
      return ordenesProduccion.rows;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
}

export const consultarDetalleOrdenProduccionDao = async (idOrdenProduccion) => {
  try {
    // Consulta SQL
    const queryHeader = `SELECT op.idOrdenProduccion, op.idSucursal, s.nombreSucursal, op.ordenTurno, op.nombrePanadero, 
                          op.fechaAProducir, op.idUsuario, u.nombreUsuario, op.fechaCierre, op.fechaCreacion, op.estadoOrden
                          FROM ORDENESPRODUCCION AS op
                          INNER JOIN SUCURSALES AS s ON op.idSucursal = s.idSucursal
                          INNER JOIN USUARIOS AS u ON op.idUsuario = u.idUsuario
                          WHERE op.idOrdenProduccion = ?
                          AND op.estado = 'A'
                          ORDER BY op.idOrdenProduccion DESC;`;

    // Ejecutar la consulta para retornar el encabezado
    const encabezadoOrden = await Connection.execute(queryHeader, [idOrdenProduccion]);

    if( encabezadoOrden.rows.length === 0){
      return 0;
    }

    const queryDetalle = `select do.idDetalleOrdenProduccion, do.idOrdenProduccion, do.idProducto, p.nombreProducto, 
                          p.idCategoria, cat.nombrecategoria, do.cantidadBandejas, do.cantidadUnidades, do.fechaCreacion
                          from DETALLESORDENESPRODUCCION AS do
                          INNER JOIN ORDENESPRODUCCION as op on do.idOrdenProduccion = op.idOrdenProduccion
                          INNER JOIN PRODUCTOS as p on do.idProducto = p.idProducto
                          INNER JOIN CATEGORIAS as cat on p.idCategoria = cat.idCategoria
                          where do.idOrdenProduccion = ?;`;

    const detalleOrden = await Connection.execute(queryDetalle, [idOrdenProduccion]);

    // Devolver los registros encontrados
    return {
      encabezadoOrden: encabezadoOrden.rows[0],
      detalleOrden: detalleOrden.rows
    };
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const eliminarOrdenProduccionDao = async (idOrdenProduccion) => {
  try {
    const query = "delete from ordenesproduccion where idOrdenProduccion = ?;";
    const res = await Connection.execute(query, [idOrdenProduccion]);

    return res.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }

}

export const ingresarOrdenProduccionDao = async (ordenProduccion) => {
  const { orden, detallesOrden } = ordenProduccion;
  
  try {
    // 1. Insertar encabezado
    const queryEncabezado = `INSERT INTO ordenesproduccion( idSucursal,  ordenTurno, nombrePanadero, fechaAProducir, idUsuario, fechaCreacion)
                                  VALUES (?, ?, ?, ?, ?, ?);
                            `;

    const resultadoEncabezado = await Connection.execute(queryEncabezado, [
      orden.idSucursal,
      orden.ordenTurno,
      orden.nombrePanadero,
      orden.fechaAProducir,
      orden.idUsuario,
      orden.fechaCreacion
    ]);
    const idOrdenGenerada = resultadoEncabezado.toJSON().lastInsertRowid;

    if (!idOrdenGenerada) {
      return 0;
    }

    // 2. Insertar detalles usando el ID generado     
    const queryDetalle = `INSERT INTO detallesordenesproduccion(idOrdenProduccion, idProducto, cantidadBandejas, cantidadUnidades, fechaCreacion )
                            VALUES (?, ?, ?, ?, ?);
                            `;

    const batch = detallesOrden.map((detalle) => ({
      sql: queryDetalle,
      args: [
        idOrdenGenerada,  // <- Usamos el ID generado aquí
        detalle.idProducto,
        detalle.cantidadBandejas,
        detalle.cantidadUnidades,
        detalle.fechaCreacion
      ]
    }));

    const resBatch = await Connection.batch(batch);

    // Extraer solo los lastInsertRowid de los resultados del batch
    const lastInsertRowids = resBatch.map(result => result.lastInsertRowid);

    return {
      idOrdenGenerada: parseInt(idOrdenGenerada),
      idDetalleOrdenProduccion: lastInsertRowids.map(id => parseInt(id)) // Convert each ID to a numeric value
    };

  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};