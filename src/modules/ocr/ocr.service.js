import { processingImagesWithClaudeIA, processingImagesWithGeminiIA } from "./ocr.utils.js";


export const procesarImagenOcrService = async (file) => {
  try {
    const imagenBase64 = file.buffer.toString("base64");
    const mimeType = file.mimetype;

    let textoRaw;

    try {
      textoRaw = await processingImagesWithGeminiIA(imagenBase64, mimeType);
    } catch (geminiError) {
      console.log("Gemini falló, usando Claude como fallback...");
      textoRaw = await processingImagesWithClaudeIA(imagenBase64, mimeType);
    }

    console.log(textoRaw);
    return textoRaw;
  } catch (error) {
    throw error;
  }
};