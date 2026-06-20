import { processingImagesWithClaudeIA, processingImagesWithGeminiIA } from "./ocr.utils.js";


export const procesarImagenOcrService = async (file) => {
  try {
    const imagenBase64 = file.buffer.toString("base64");
    const mimeType = file.mimetype;

    let detalleProductosImage;

    // try {
      detalleProductosImage = await processingImagesWithGeminiIA(imagenBase64, mimeType);
    // } catch (geminiError) {
    //   console.log("Gemini falló, usando Claude como fallback...");
    //   detalleProductosImage = await processingImagesWithClaudeIA(imagenBase64, mimeType);
    // }
    return JSON.parse(detalleProductosImage);
  } catch (error) {
    throw error;
  }
};

export const procesarImagenOcrServiceMock = async (file) => {
  try {
    // const imagenBase64 = file.buffer.toString("base64");
    // const mimeType = file.mimetype;

    const textoRaw = {
      detalleventa: [
        {
          idProducto: "1",
          nombreProducto: "Frances",
          Sobrantes: 2,
        },
        {
          idProducto: "4",
          nombreProducto: "Pirujo grande",
          Sobrantes: 5,
        },
        {
          idProducto: "5",
          nombreProducto: "Pirujo integral",
          Sobrantes: 2,
        },
        {
          idProducto: "6",
          nombreProducto: "Baguett",
          Sobrantes: 6,
        },
        {
          idProducto: "7",
          nombreProducto: "Pan de agua",
          Sobrantes: 4,
        },
        {
          idProducto: "8",
          nombreProducto: "Lenguas",
          Sobrantes: 5,
        },
        {
          idProducto: "9",
          nombreProducto: "Pan dulce pequeño",
          Sobrantes: 5,
        },
        {
          idProducto: "10",
          nombreProducto: "Tostado pequeño",
          Sobrantes: 2,
        },
        {
          idProducto: "41",
          nombreProducto: "Pan grande",
          Sobrantes: 2,
        },
        {
          idProducto: "43",
          nombreProducto: "Campechanas",
          Sobrantes: 3,
        },
        {
          idProducto: "52",
          nombreProducto: "Pirujo pequeño",
          Sobrantes: 5,
        },
        {
          idProducto: "54",
          nombreProducto: "Pirujo mediano",
          Sobrantes: 2,
        },
        {
          idProducto: "19",
          nombreProducto: "Magdalena",
          Sobrantes: 5,
        },
        {
          idProducto: "20",
          nombreProducto: "Magdalena chocovainilla",
          Sobrantes: 2,
        },
        {
          idProducto: "21",
          nombreProducto: "Pan de banano",
          Sobrantes: 9,
        },
        {
          idProducto: "22",
          nombreProducto: "Zepelin",
          Sobrantes: 3,
        },
        {
          idProducto: "32",
          nombreProducto: "Hojaldre variedad",
          Sobrantes: 2,
        },
        {
          idProducto: "33",
          nombreProducto: "Croassant",
          Sobrantes: 3,
        },
        {
          idProducto: "35",
          nombreProducto: "Donas variedad",
          Sobrantes: 8,
        },
        {
          idProducto: "38",
          nombreProducto: "Palito bolsa",
          Sobrantes: 7,
        },
        {
          idProducto: "40",
          nombreProducto: "Galleta",
          Sobrantes: 2,
        },
        {
          idProducto: "44",
          nombreProducto: "Tostado empacado",
          Sobrantes: 2,
        },
        {
          idProducto: "45",
          nombreProducto: "Pan baguett",
          Sobrantes: 1,
        },
        {
          idProducto: "47",
          nombreProducto: "Torta mejicana",
          Sobrantes: 1,
        },
        {
          idProducto: "48",
          nombreProducto: "Pirujo de 1.50",
          Sobrantes: 1,
        },
        {
          idProducto: "53",
          nombreProducto: "Abiscochado",
          Sobrantes: 1,
        },
      ],
    };

    return textoRaw;
  } catch (error) {
    throw error;
  }
};
