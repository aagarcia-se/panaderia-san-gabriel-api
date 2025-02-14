import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


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
            return 0;
        }

        return result.rows;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

