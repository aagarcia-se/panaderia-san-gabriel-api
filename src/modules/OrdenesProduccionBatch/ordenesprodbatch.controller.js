import { ingresarOrdenProduccionBatchService } from "./ordenesprodbatch.service.js";

export const ingresarOrdenProduccionBatchController = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ status: 400, message: 'No se recibió ningún archivo CSV' });
        }

        if (!req.body.ordenHaader) {
            return res.status(400).json({ status: 400, message: 'No se recibieron datos de la orden de producción' });
        }

        const csvString = req.file.buffer.toString('utf-8');
        const ordenHaader = JSON.parse(req.body.ordenHaader);
        const idOrdenProduccion = await ingresarOrdenProduccionBatchService(ordenHaader, csvString);
        const responseData = {
            status: 200,
            message: "Ingreso exitoso",
            idOrdenProduccion
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};