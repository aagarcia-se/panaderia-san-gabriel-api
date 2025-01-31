import { transporter } from "./transporter.js";

export const enviarEmail = async (data, mailBody, dataAttachments = null) => {
    // Detalles del correo electrónico
    const mailOptions = {
      from: "panaderiasangabrields@gmail.com", // Remitente fijo
      to: data.correoDestino, // Correo destino (debe venir en el objeto `data`)
      subject: data.asunto, // Asunto del correo (debe venir en el objeto `data`)
      html: mailBody, // Plantilla del correo (HTML)
      // Adjuntos (opcional, solo si se proporciona `dataAttachments`)
      attachments: dataAttachments
        ? [
            {
              filename: dataAttachments.fileName, // Nombre del archivo
              content: dataAttachments.file, // Contenido del archivo (Buffer)
              contentType: dataAttachments.typeFile, // Tipo de archivo (ej: "application/pdf")
            },
          ]
        : [], // Si no hay adjuntos, se envía un array vacío
    };
  
    // Enviar el correo electrónico
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Correo electrónico enviado: " + info.response);
      return info; // Devuelve la información del envío
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      throw error; // Lanza el error para que pueda ser manejado externamente
    }
  };