import { processingImagesWithGeminiIA } from "./ocr.utils.js";


export const procesarImagenOcrService = async (image) => {
  try {
    const imagenBase64 = image.buffer.toString("base64");
    const mimeType = image.mimetype;

    // const textoRaw = await processingImagesWithClaudeIA(imagenBase64, mimeType);
    const textoRaw = await processingImagesWithGeminiIA(imagenBase64, mimeType);

    return textoRaw;
  } catch (error) {
    throw error;
  }
};