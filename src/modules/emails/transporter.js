import nodemailer from "nodemailer";
import { config } from "../../config/index.js";

//se modifico el transporter

const emailConfig = config.email;

if (!emailConfig?.user || !emailConfig?.pass) {
  throw new Error(
    "Configuración SMTP incompleta: define SMTP_USER y SMTP_PASS en las variables de entorno."
  );
}

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailConfig.user,
    pass: emailConfig.pass,
  },
});
