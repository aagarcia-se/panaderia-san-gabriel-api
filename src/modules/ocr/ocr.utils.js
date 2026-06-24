import anthropicIA from "../../config/AIModels/Anthropic.js";
import geminiIA from "../../config/AIModels/GeminiIA.js";
import sharp from "sharp";

export const processingImagesWithClaudeIA = async (imagenBase64, mimeType) => {
  try {
    const response = await anthropicIA.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mimeType,
                data: imagenBase64
              }
            },
            {
              type: "text",
              text: `Esta imagen contiene una hoja de "Control de Sobrantes" con DOS tablas lado a lado.
                    Cada tabla tiene 3 columnas: Codigo, Nombre Producto y Sobrante.
                    Los valores en la columna Sobrante pueden estar escritos a mano con lapicero.

                    Extrae TODOS los productos de AMBAS tablas y retorna ÚNICAMENTE un JSON válido
                    con el siguiente formato, sin texto adicional, sin markdown, sin backticks:
                    {"detalleVenta":[{"idProducto":"...","nombreProducto":"...","Sobrantes":0}]}

                    Reglas:
                    - idProducto es el valor de la columna Codigo (número)
                    - nombreProducto es el valor de la columna Nombre Producto
                    - Sobrantes es el valor numérico de la columna Sobrante
                    - Si Sobrante es 0 o está vacío, NO incluyas ese producto en el resultado
                    - Si un valor no se puede leer claramente, usa -1`
            }
          ]
        }
      ]
    });

    return response.content[0].text;
  } catch (error) {
    console.log("Error en Claude IA:", error);
    throw error;
  }
};

export const processingImagesWithGeminiIA = async (imagenBase64, mimeType) => {
  try {
    const model = geminiIA.getGenerativeModel({ 
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: imagenBase64
        }
      },
      {
        text: `Esta imagen contiene una hoja de "Control de Sobrantes" con DOS tablas lado a lado.
                Cada tabla tiene 3 columnas: Codigo, Nombre Producto y Sobrante.
                Los valores en la columna Sobrante pueden estar escritos a mano con lapicero.

                Extrae TODOS los productos de AMBAS tablas y retorna ÚNICAMENTE un JSON válido
                con el siguiente formato, sin texto adicional, sin markdown, sin backticks:
                {"detalleVenta":[{"idProducto":"...","nombreProducto":"...","Sobrantes":0}]}

                Reglas:
                - idProducto es el valor de la columna Codigo (número)
                - nombreProducto es el valor de la columna Nombre Producto
                - Sobrantes es el valor numérico de la columna Sobrante
                - Si Sobrante es 0 o está vacío, NO incluyas ese producto en el resultado
                - Si un valor no se puede leer claramente, usa -1`
      }
    ]);

    const text = result.response.candidates[0].content.parts[0].text;
    return text;

  } catch (error) {
    console.log("Error en Gemini IA:", error);
    throw error;
  }
};

export async function optimizeImage(buffer) {
  const MAX_SIZE = 8 * 1024 * 1024; // 8 MB

  // Si ya cumple, devolverla
  if (buffer.length <= MAX_SIZE) {
    return buffer;
  }

  let width = null;
  let quality = 90;
  let output = buffer;

  const metadata = await sharp(buffer).metadata();
  width = metadata.width;

  while (output.length > MAX_SIZE) {
    output = await sharp(buffer)
      .resize(
        width
          ? {
              width,
              withoutEnlargement: true,
            }
          : undefined
      )
      .jpeg({
        quality,
        mozjpeg: true,
      })
      .toBuffer();

    // Si ya cumple, salir
    if (output.length <= MAX_SIZE) {
      break;
    }

    // Primero bajar calidad
    if (quality > 30) {
      quality -= 10;
    } else {
      // Si ya no podemos bajar mucho más la calidad,
      // reducimos dimensiones un 20%
      width = Math.floor(width * 0.8);

      // Evitar tamaños absurdamente pequeños
      if (width < 500) {
        throw new Error(
          `No fue posible reducir la imagen por debajo de 8 MB. Tamaño actual: ${(output.length / 1024 / 1024).toFixed(2)} MB`
        );
      }
    }
  }

  console.log(
    `Imagen optimizada: ${(output.length / 1024 / 1024).toFixed(2)} MB`
  );

  return output;
}