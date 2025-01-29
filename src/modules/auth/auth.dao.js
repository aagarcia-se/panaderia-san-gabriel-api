
import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const iniciarSesionDao = async (data) => {
    try {
        // Query para obtener los datos del usuario
        const queryUsuario = `
            SELECT u.nombreUsuario, u.apellidoUsuario, u.telefonoUsuario, u.idRol, r.nombreRol
            FROM USUARIOS u
            INNER JOIN ROLES r ON u.idRol = r.idRol
            WHERE u.usuario = ?
            AND u.contrasena = ?
            AND u.estadoUsuario = 'A';`;

        const resUserData = await Connection.execute(queryUsuario, [data.usuario, data.contrasena]);


        // Si no se encuentra el usuario, devolver null o manejar el error
        if (!resUserData || resUserData.rows.length === 0) {
            return 0;
        }

        const userData = resUserData.rows[0];

        // Query para obtener los permisos del usuario
        const queryPermisos = `
            SELECT P.idPermiso, P.nombrePermiso, P.rutaAcceso
            FROM ROLESPERMISOS RP
            INNER JOIN ROLES R ON RP.idRol = R.idRol
            INNER JOIN PERMISOS P ON RP.idPermiso = P.idPermiso
            WHERE R.estado = 'A' AND P.estado = 'A'
            AND R.idRol = ?
            ORDER BY P.idPermiso ASC;`;

        const resultPermisos = await Connection.execute(queryPermisos, [userData.idRol]);

        const userPermisos = resultPermisos.rows;

        // Formatear el resultado en un JSON válido
        const response = {
            usuario: {
                nombre: userData.nombreUsuario,
                apellido: userData.apellidoUsuario,
                telefono: userData.telefonoUsuario,
                idRol: userData.idRol,
                rol: userData.nombreRol,
            },
            permisos: userPermisos.map((permiso) => ({
                idPermiso: permiso.idPermiso,
                nombrePermiso: permiso.nombrePermiso,
                rutaAcceso: permiso.rutaAcceso,
            })),
        };

        return response;

    } catch (error) {
        console.log(error)
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
};


