import { ingresarOrdenProduccionBatchService } from "./ordenesprodbatch.service.js";
import iconv from "iconv-lite";
import chardet from "chardet";

export const ingresarOrdenProduccionBatchController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 400, message: "No se recibió ningún archivo CSV" });
    }

    if (!req.body.ordenHaader) {
      return res.status(400).json({ status: 400, message: "No se recibieron datos de la orden de producción" });
    }

    // ✅ Detectar encoding y decodificar correctamente
    const encoding   = chardet.detect(req.file.buffer) || "UTF-8";
    const csvString  = iconv.decode(req.file.buffer, encoding);

    const ordenHaader     = JSON.parse(req.body.ordenHaader);
    const ordenProduccion = await ingresarOrdenProduccionBatchService(ordenHaader, csvString);

    res.status(200).json({
      status: 200,
      message: "Ingreso exitoso",
      ordenProduccion,
    });
  } catch (error) {
    next(error);
  }
};