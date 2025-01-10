import { createPool } from "mysql2/promise";
import { config } from "./index.js";

const databaseCredentials = config.database;

export const Connection = createPool({
    host: databaseCredentials.host,
    user: databaseCredentials.user,
    password: databaseCredentials.password,
    port: databaseCredentials.port,
    database: databaseCredentials.database
});


// Función para establecer la conexión
export const establecerConexion = async () => {
    try {
        // Obtener una conexión del pool
        const connection = await Connection.getConnection();
        console.log('Conexión establecida correctamente');
        return connection;
    } catch (error) {
        console.error('Error al establecer la conexión:', error.sqlMessage);
        // Realizar acciones de manejo de errores, como enviar una respuesta de error al cliente
        throw error;
    }
};

// Función para cerrar la conexión
export const cerrarConexion = (connection) => {
    if (connection) {
        connection.release();
        console.log('Conexión cerrada correctamente');
    }
};
