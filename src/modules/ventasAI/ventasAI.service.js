import { procesarImagenOcrService } from "../ocr/ocr.service.js";

export const IngresarVentasAIService = async (ventaHeader, image) => {
  try {
    
    const textoRaw = await procesarImagenOcrService(image);

    console.log(textoRaw);

    return textoRaw;
  } catch (error) {
    throw error;
  }
};