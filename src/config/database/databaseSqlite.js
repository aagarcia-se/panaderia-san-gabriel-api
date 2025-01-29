import { createClient } from "@libsql/client";
import { config } from "../index.js";

const databaseCredentials = config.database;

// Crear cliente de conexión a SQLite usando @libsql/client
export const Connection = createClient({
    url: databaseCredentials.bd_url, // URL proporcionada por el servicio Turso
    authToken: databaseCredentials.bd_token, // Token de autenticación si aplica
});
