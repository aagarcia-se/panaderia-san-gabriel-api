import { procesarImagenOcrService } from "./ocr.service.js";


export const procesarImagenOcrController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: 400,
        message: "No se recibió ninguna imagen"
      });
    }

    const productos = await procesarImagenOcrService(req.file);

    res.status(200).json({
      status: 200,
      message: "Imagen procesada exitosamente",
      productos
    });
  } catch (error) {
    next(error);
  }
};