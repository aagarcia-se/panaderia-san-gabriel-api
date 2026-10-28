import { transporter } from "./transporter.js";
import { config } from "../../config/index.js";

export const enviarEmail = async (data, mailBody, dataAttachments = null) => {

  // Si correoDestino es un array, separar destinatario principal de las copias
  const destinatarios = Array.isArray(data.correoDestino)
    ? data.correoDestino
    : [data.correoDestino];

  const [to, ...cc] = destinatarios; // Primer correo = to, el resto = cc

  const mailOptions = {
    from: config.email.from,
    to,
    cc: cc.length > 0 ? cc : undefined, // Solo agrega cc si hay destinatarios extra
    subject: data.asunto,
    html: mailBody,
    attachments: dataAttachments
      ? [
          {
            filename: dataAttachments.fileName,
            content: dataAttachments.file,
            contentType: dataAttachments.typeFile,
          },
        ]
      : [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo electrónico enviado: " + info.response);
    return info;
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw error;
  }
};