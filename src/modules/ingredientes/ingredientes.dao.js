import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";


export const consultarIngredientes = async (idProducto) => {
    try{
        const query = `select unidadesPorBandeja from CONFIGORDEN where idProducto = ?;`
        const result = await Connection.execute(query, [idProducto]);
        if(result.rows.length === 0){
            return 0;
        }

        return result.rows[0].unidadesPorBandeja;
    }catch(error){
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

