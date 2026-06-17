import anthropicIA from "../../config/AIModels/anthropic.js";
import geminiIA from "../../config/AIModels/GeminiIA.js";

export const processingImagesWithIA = async (imagenBase64, mimeType) => {
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
              text: `Esta imagen contiene una tabla datos escritos con lapiceron por el usuario
              tiene un nombre de producto y una cantidad, en la parte superior hay una fecha en formato
              dd/mm/yyyy. 
              
              Extrae todos los datos visibles y retorna ÚNICAMENTE un JSON válido 
              con el siguiente formato, sin texto adicional, sin markdown, sin backticks:
              {"encabezado":{"fecha":"dd/mm/yyyy"},"detalleventa":[{"nombre":"...","cantidad":0}]}
              
              Si un valor de cantidad no se puede leer claramente, usa -1.`
            }
          ]
        }
      ]
    });

    return response.content[0].text;
  } catch (error) {
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
        text: `Esta imagen contiene una tabla datos escritos con lapiceron por el usuario
        tiene un nombre de producto y una cantidad, en la parte superior hay una fecha en formato
        dd/mm/yyyy. 
        
        Extrae todos los datos visibles y retorna ÚNICAMENTE un JSON válido 
        con el siguiente formato, sin texto adicional, sin markdown, sin backticks:
        {"encabezado":{"fecha":"dd/mm/yyyy"},"detalleventa":[{"nombre":"...","cantidad":0}]}
        
        Si un valor de cantidad no se puede leer claramente, usa -1.`
      }
    ]);

    const text = result.response.candidates[0].content.parts[0].text;
    return text;

  } catch (error) {
    console.error("Error en Gemini IA:", error);
    throw error;
  }
};