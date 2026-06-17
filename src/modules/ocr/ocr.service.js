import { processingImagesWithGeminiIA, processingImagesWithIA } from "./ocr.utils.js";


export const procesarImagenOcrService = async (file) => {
  try {
    const imagenBase64 = file.buffer.toString("base64");
    const mimeType = file.mimetype;

    const textoRaw = await processingImagesWithIA(imagenBase64, mimeType);
    //const textoRaw = await processingImagesWithGeminiIA(imagenBase64, mimeType);

    console.log(textoRaw);

    // if (productos.length === 0) {
    //   const error = getError(1);
    //   throw new CustomError(error);
    // }

    // return productos;
  } catch (error) {
    throw error;
  }
};