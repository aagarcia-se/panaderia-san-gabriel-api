import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


export const consultarRecetasDao = async () => {
  try{
      const query = `SELECT r.idReceta, r.idProducto,  p.nombreProducto, r.idIngrediente, i.nombreIngrediente, r.cantidadNecesaria, 
                      r.unidadMedida 
                      FROM recetas r
                      INNER JOIN ingredientes i ON r.idIngrediente = i.idIngrediente
                      INNER JOIN productos p ON r.idProducto = p.idProducto;`;
      const result = await Connection.execute(query);
      
      if(result.rows.length === 0){
          return 0;
      }

      return result.rows;
  }catch(error){
    console.log(error)
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
  }
}

export const consultarRecetaDao = async (idProducto) => {
    try{
        const query = `SELECT r.idReceta, r.idProducto,  p.nombreProducto, r.idIngrediente, i.nombreIngrediente, r.cantidadNecesaria, 
                        r.unidadMedida 
                        FROM recetas r
                        INNER JOIN ingredientes i ON r.idIngrediente = i.idIngrediente
                        INNER JOIN productos p ON r.idProducto = p.idProducto  -- Corregido aquí
                        WHERE r.idProducto = ?;`;
        const result = await Connection.execute(query, [idProducto]);
        
        if(result.rows.length === 0){
            return {
              idReceta: 0
            };
        }

        return result.rows;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const ingresarRecetaDao = async (receta) => {
    const { idProducto, detallesReceta } = receta;
  
    try {
      // 1. Preparar el batch de inserciones para los detalles de la receta
      const queryDetalleReceta = `
        INSERT INTO recetas (idProducto, idIngrediente, cantidadNecesaria, unidadMedida, fechaCreacion)
        VALUES (?, ?, ?, ?, ?);
      `;
  
      // 2. Crear el batch con los detalles de la receta
      const batch = detallesReceta.map((detalle) => ({
        sql: queryDetalleReceta,
        args: [
          idProducto, // <- Usamos el idProducto aquí
          detalle.idIngrediente,
          detalle.cantidadNecesaria,
          detalle.unidadMedida,
          detalle.fechaCreacion
        ]
      }));
  
      // 3. Ejecutar el batch
      const resBatch = await Connection.batch(batch);
  
      // 4. Extraer los lastInsertRowid de los resultados del batch
      const lastInsertRowids = resBatch.map(result => result.lastInsertRowid);
  
      // 5. Validar si se insertaron registros
      if (lastInsertRowids.length === 0) {
        return 0; // No se insertó ningún registro
      }
  
      // 6. Retornar la receta completa si se insertaron registros
      return receta;
  
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
};

export const actualizarRecetaDao = async (receta) => {
    const { idProducto, detallesReceta } = receta;
  
    try {
      // 1. Preparar el batch de actualizaciones para los detalles de la receta
      const queryActualizarReceta = `
        UPDATE recetas 
        SET idIngrediente = ?, cantidadNecesaria = ?, unidadMedida = ?
        WHERE idProducto = ?;
      `;
  
      // 2. Crear el batch con los detalles de la receta
      const batch = detallesReceta.map((detalle) => ({
        sql: queryActualizarReceta,
        args: [
          detalle.idIngrediente,
          detalle.cantidadNecesaria,
          detalle.unidadMedida,
          idProducto // <- ID del producto para asegurar que pertenece a la receta correcta
        ]
      }));
  
      // 3. Ejecutar el batch
      const resBatch = await Connection.batch(batch);
  
      // 4. Calcular el número de registros actualizados
      const registrosActualizados = resBatch.reduce((acc, result) => acc + result.affectedRows, 0);
  
      // 5. Validar si se actualizaron registros
      if (registrosActualizados === 0) {
        return 0; // No se actualizó ningún registro
      }
  
      // 6. Retornar la receta completa si se actualizaron registros
      return receta;
  
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
};

export const elminarRecetaDao = async (idProducto) => {
    try{

        const deleteQuery = `DELETE FROM recetas WHERE idProducto = ?;`;

        const result = await Connection.execute(deleteQuery, [idProducto]);

        return result.rowsAffected;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}