import { ingresarVentaBatchService } from "./ventasbatch.service.js";

export const ingresarVentaBatchController = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ status: 400, message: "No se recibió ningún archivo Excel" });
        }

        if (!req.body.venta) {
            return res.status(400).json({ status: 400, message: "No se recibieron datos de la venta" });
        }

        const nombreArchivo = req.files[0].originalname;
        if (!nombreArchivo.match(/\.(xlsx|xls)$/i)) {
            return res.status(400).json({ status: 400, message: "Solo se permiten archivos Excel (.xlsx o .xls)" });
        }
        const xlsxString = req.files[0].buffer;
        const venta   = JSON.parse(req.body.venta);
        // ✅ Pasar el buffer directo — el service hace el parseo
        const idVenta = await ingresarVentaBatchService(venta, xlsxString);

        res.status(200).json({
            status:  200,
            message: "Ingreso exitoso",
            idVenta,
        });
    } catch (error) {
        next(error);
    }
};