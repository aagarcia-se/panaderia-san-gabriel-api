import { getDatabaseHealthDao } from "./health.dao.js";


export const getDatabaseHealthService = async () => {
    try {
        await getDatabaseHealthDao();
        return {
            status: "ok",
            database: "ok",
        };
    } catch (error) {
        throw error;
    }
};