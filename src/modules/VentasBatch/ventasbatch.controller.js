import { ingresarVentaBatchService } from "./ventasbatch.service.js";



export const ingresarVentaBatchController = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: 400, message: 'No se recibió ningún archivo CSV' });
        }

        if (!req.body.venta) {
            return res.status(400).json({ status: 400, message: 'No se recibieron datos de la venta' });
        }

        const csvString = req.files[0].buffer.toString('utf-8');
        const venta = JSON.parse(req.body.venta);
        const idVenta = await ingresarVentaBatchService(venta, csvString);
        const responseData = {
            status: 200,
            message: "Ingreso exitoso",
            idVenta
        };
        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};