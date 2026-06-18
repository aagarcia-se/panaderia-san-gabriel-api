import { procesarImagenOcrService } from "../ocr/ocr.service.js";

export const IngresarVentasAIService = async (ventaHeader, image) => {
  try {
    //se agregarob apis keys
    const textoRaw = await procesarImagenOcrService(image);

    console.log(textoRaw);

    return textoRaw;
  } catch (error) {
    throw error;
  }
};