import { ingresarOrdenProduccionBatchService } from "./ordenesprodbatch.service.js";
import * as XLSX from "xlsx";

export const ingresarOrdenProduccionBatchController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, message: "No se recibió ningún archivo Excel" });
    }

    if (!req.body.ordenHaader) {
      return res.status(400).json({ status: 400, message: "No se recibieron datos de la orden de producción" });
    }

    // ✅ Validar que sea xlsx o xls
    const nombreArchivo = req.file.originalname;
    if (!nombreArchivo.match(/\.(xlsx|xls)$/i)) {
      return res.status(400).json({ status: 400, message: "Solo se permiten archivos Excel (.xlsx o .xls)" });
    }

    // ✅ Pasar buffer directo al service — el service hace el parseo
    const xlsxString = req.file.buffer;
    const ordenHaader     = JSON.parse(req.body.ordenHaader);
    const ordenProduccion = await ingresarOrdenProduccionBatchService(ordenHaader, xlsxString);

    res.status(200).json({
      status: 200,
      message: "Ingreso exitoso",
      ordenProduccion,
    });
  } catch (error) {
    next(error);
  }
};