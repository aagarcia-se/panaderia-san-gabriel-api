import { enviroment } from "./env/enviroment.js";

// Obtener el valor de NODE_ENV o usar 'dev' por defecto
const env = process.env.NODE_ENV;

// Exportar la configuración correspondiente al ambiente
const config = enviroment[env];

export { config };