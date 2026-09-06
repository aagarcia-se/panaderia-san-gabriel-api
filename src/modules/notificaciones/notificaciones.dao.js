import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarActivacionesNotificacionesDao = async () => {
    try {
        const script = `SELECT 
                        u.idUsuario,
                        u.nombreUsuario,
                        u.apellidoUsuario,
                        u.correoUsuario,
                        u.aliasUsuario,
                        an.activo,
                        an.tipoEvento
                    FROM USUARIOS u
                    LEFT JOIN activacion_notificaciones an 
                        ON an.idUsuario = u.idUsuario 
                        AND an.tipoEvento = 'orden_especial'
                    WHERE u.idRol = 1
                    AND u.estadoUsuario = 'A'
                    AND u.estado = 'A';`;
        const result = await Connection.execute(script);

        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const activarNotificacionesDao = async (usuariosNoti) => {
    try {
        const insertNoti = `INSERT INTO activacion_notificaciones (idUsuario, tipoEvento, activo, fechaCreacion)
                            VALUES (?, ?, ?, ?);`;

        const batch = usuariosNoti.map((usuario) => ({
            sql: insertNoti,
            args: [
                usuario.idUsuario,
                usuario.tipoEvento,
                usuario.activo,
                usuario.fechaCreacion
            ]
        }));

        const result = await Connection.batch(batch);
        return result.length;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const desactivarNotificacionesDao = async (usuariosNoti) => {
    try {
        const deleteNoti = `UPDATE activacion_notificaciones SET activo = ?, fechaActualizacion = ? WHERE idUsuario = ? AND tipoEvento = ?;`;

        const batch = usuariosNoti.map((usuario) => ({
            sql: deleteNoti,
            args: [
                usuario.activo,
                usuario.fechaActualizacion,
                usuario.idUsuario,
                usuario.tipoEvento
            ]
        }));

        const result = await Connection.batch(batch);
        return result.length;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const consultarUsuariosNotificacionesDao = async () => {
    try {
        const script = `SELECT 
                        u.idUsuario,
                        u.correoUsuario,
                        an.activo,
                        an.tipoEvento
                    FROM USUARIOS u
                    LEFT JOIN activacion_notificaciones an 
                        ON an.idUsuario = u.idUsuario 
                        AND an.tipoEvento = 'orden_especial'
                    WHERE u.idRol = 1
                    AND u.estadoUsuario = 'A'
                    AND u.estado = 'A'
                    AND an.activo = 1;`;
        const result = await Connection.execute(script);

        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}

export const gestionarNotificacionDao = async (usuariosNoti) => {
    try {
        const deleteNoti = `UPDATE activacion_notificaciones SET activo = ?, fechaActualizacion = ? WHERE idUsuario = ? AND tipoEvento = ?;`;

        const batch = usuariosNoti.map((usuario) => ({
            sql: deleteNoti,
            args: [
                usuario.activo,
                usuario.fechaActualizacion,
                usuario.idUsuario,
                usuario.tipoEvento
            ]
        }));

        const result = await Connection.batch(batch);
        return result.length;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}