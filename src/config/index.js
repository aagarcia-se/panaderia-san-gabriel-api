import { enviroment } from "./env/enviroment.js";

// Obtener el valor de APP_ENV o usar 'dev' por defecto
const env = process.env.APP_ENV || 'development';

// Exportar la configuración correspondiente al ambiente
const config = enviroment[env];

export { config };