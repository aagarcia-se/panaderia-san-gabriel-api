import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const getDatabaseHealthDao = async () => {
    try {
        const script = `select 1`;
        const result = await Connection.execute(script);

        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}