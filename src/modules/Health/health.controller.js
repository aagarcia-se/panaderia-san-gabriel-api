import { getDatabaseHealthService } from "./health.service.js";

const healthController = {

    getHealth: (_req, res) => {

        res.json({
            status: "ok",
        });

    },

    getDatabaseHealth: async (_req, res, next) => {
        try {
            const databaseHealth = await getDatabaseHealthService();

            const responseData = {
                status: 200,
                ...databaseHealth,
            };
            res.status(200).json(responseData);

        } catch (error) {
            next(error);
        }

    },

};

export default healthController;