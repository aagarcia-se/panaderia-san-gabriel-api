import { CatalogItem } from "twilio/lib/rest/content/v1/content.js";
import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ingresarOrdenEspecialDao = async (ordenesEspeciales) => {
    const { ordenEncabezado, ordenDetalle } = ordenesEspeciales;
    
    try {
      // 1. Insertar encabezado
      const queryEncabezado = ` insert into ORDENESESPECIALES (idSucursal, idUsuario, nombreCliente, telefonoCliente, fechaEntrega, fechaAProducir, fechaCreacion)
                                values (?, ?, ?, ?, ?, ?, ?);
                              `;
  
      const resultadoEncabezado = await Connection.execute(queryEncabezado, [
        ordenEncabezado.idSucursal,
        ordenEncabezado.idUsuario,
        ordenEncabezado.nombreCliente,
        ordenEncabezado.telefonoCliente,
        ordenEncabezado.fechaEntrega,
        ordenEncabezado.fechaAProducir,
        ordenEncabezado.fechaCreacion,
      ]);

      const idOrdenGenerada = resultadoEncabezado.toJSON().lastInsertRowid;
  
      if (!idOrdenGenerada) {
        return 0;
      }
      // 2. Insertar detalles usando el ID generado     
      const queryDetalle = `insert into DETALLESORDENESESPECIALES (idOrdenEspecial, idProducto, cantidadUnidades, fechaCreacion)
                            values (?, ?, ?, ?);
                              `;
  
      const batch = ordenDetalle.map((detalle) => ({
        sql: queryDetalle,
        args: [
          idOrdenGenerada,  // <- Usamos el ID generado aquí
          detalle.idProducto,
          detalle.cantidadUnidades || 0,
          detalle.fechaCreacion
        ]
      }));
  
      const resBatch = await Connection.batch(batch);
  
      // Extraer solo los lastInsertRowid de los resultados del batch
      const lastInsertRowids = resBatch.map(result => result.lastInsertRowid);
  
      return {
        idOrdenGenerada: parseInt(idOrdenGenerada),
        idDetellaOrdenEspecial: lastInsertRowids.map(id => parseInt(id)) // Convert each ID to a numeric value
      };
  
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
};

export const consultarOrdenesEspecialesDao = async (idRol, idSucursal) => {
    try{
        const query = `SELECT oe.idOrdenEspecial, oe.idSucursal, su.nombreSucursal AS sucursalEntrega, oe.nombreCliente, oe.telefonoCliente,
                        oe.fechaEntrega, oe.FechaAproducir, oe.idUsuario, us.usuario AS ordenIngresadaPor, oe.estado  
                        FROM 
                            ORDENESESPECIALES oe
                            INNER JOIN SUCURSALES su ON oe.idSucursal = su.idSucursal
                            INNER JOIN USUARIOS us ON oe.idUsuario = us.idUsuario
                        WHERE
                            (us.idRol = ? OR oe.idSucursal = ?)
                         ORDER BY 
                            oe.idOrdenEspecial DESC;`;

        const OrdenesEspeciales = await Connection.execute(query, [idRol, idSucursal]);

        return OrdenesEspeciales.rows;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const consultarOrdeEspecialByIdDao = async (idOrdenEspecial) => {
    try{
        const queryHeader = `select oe.idOrdenEspecial, oe.idSucursal, su.nombreSucursal sucursalEntrega, oe.nombreCliente, oe.telefonoCliente,
                             oe.fechaEntrega, oe.FechaAproducir, oe.idUsuario, us.usuario ordenIngresadaPor,
                             oe.estado  from ORDENESESPECIALES oe
                             inner join SUCURSALES su ON oe.idSucursal = su.idSucursal
                             inner join USUARIOS us ON oe.idUsuario = us.idUsuario
                             and oe.idOrdenEspecial = ?;`
        
        const header = await Connection.execute(queryHeader, [idOrdenEspecial]);

        if( header.rows.length === 0){
            return 0;
        }

        const queryDetalle = `select doe.idDetalleOrdenEspecial, doe.idOrdenEspecial, doe.idProducto, p.nombreProducto,
                            doe.cantidadUnidades, doe.fechaCreacion
                            from DETALLESORDENESESPECIALES doe
                            inner join PRODUCTOS p ON doe.idProducto = p.idProducto
                            where doe.idOrdenEspecial = ?;`;
        
        const detalle = await Connection.execute(queryDetalle, [idOrdenEspecial])

            // Devolver los registros encontrados
    return {
        ordenEncabezado: header.rows[0],
        ordenDetalle: detalle.rows
      };
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};

export const elminarOrdenEspecialByIdDao = async (idOrdenEspecial) => {
  try{
    const script = `delete from ORDENESESPECIALES where idOrdenEspecial = ?;`;

    const resDelete = await Connection.execute(script, [idOrdenEspecial]);

    return resDelete.rowsAffected;
  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarOrdenEspecialByIdDao = async (ordenesEspeciales) => {
  try{
    const { ordenEncabezado, ordenDetalle } = ordenesEspeciales;

    const scriptUpdateHeader = `update ORDENESESPECIALES SET idSucursal = ? , idUsuario = ?, nombreCliente = ?, 
                                telefonoCliente = ?, fechaEntrega = ?, fechaAProducir = ?
                                where idOrdenEspecial = ?`;

    const resUpdateHader = await Connection.execute(scriptUpdateHeader, [
      ordenEncabezado.idSucursal,
      ordenEncabezado.idUsuario,
      ordenEncabezado.nombreCliente,
      ordenEncabezado.telefonoCliente,
      ordenEncabezado.fechaEntrega,
      ordenEncabezado.fechaAProducir,
      ordenEncabezado.idOrdenEspecial
    ]);

    if(resUpdateHader.rowsAffected === 0){
      return 0
    }

    const scriptUpdateDetalle = `update DETALLESORDENESESPECIALES set cantidadUnidades = ?
                                 where idDetalleOrdenEspecial = ?`;

    const batch = ordenDetalle.map((detalle) => ({
      sql: scriptUpdateDetalle,
      args: [
        detalle.cantidadUnidades,
        detalle.idDetalleOrdenEspecial
      ]
    }));

    const resBatchDetallet = await Connection.batch(batch);

    return ordenesEspeciales;
  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}
