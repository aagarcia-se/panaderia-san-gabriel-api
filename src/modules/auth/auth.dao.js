import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const iniciarSesionDao = async (usuario) => {
  try {
    // 1. Query para obtener los datos del usuario (incluyendo la contraseña hasheada)
    const queryUsuario = `SELECT u.idUsuario, u.usuario, u.nombreUsuario, u.apellidoUsuario,
                          u.telefonoUsuario, u.idRol, r.nombreRol, u.contrasena, u.estadoUsuario
                          FROM USUARIOS u
                          INNER JOIN ROLES r ON u.idRol = r.idRol
                          WHERE u.usuario = ?
                          AND u.estado = 'A';`;

    const resUserData = await Connection.execute(queryUsuario, [usuario]);

    // 2. Verificar si el usuario existe
    if (!resUserData || resUserData.rows.length === 0) {
      return null; // Usuario no encontrado
    }

    const userData = resUserData.rows[0];

    // 3. Query para obtener los permisos del usuario
    const queryPermisos = `
                            SELECT P.idPermiso, P.nombrePermiso, P.rutaAcceso
                            FROM ROLESPERMISOS RP
                            INNER JOIN ROLES R ON RP.idRol = R.idRol
                            INNER JOIN PERMISOS P ON RP.idPermiso = P.idPermiso
                            WHERE R.estado = 'A' AND P.estado = 'A'
                            AND R.idRol = ?
                            ORDER BY P.idPermiso ASC;`;

    const resultPermisos = await Connection.execute(queryPermisos, [userData.idRol,]);

    const userPermisos = resultPermisos.rows;

    // 4. Formatear el resultado en un JSON válido
    const response = {
      usuario: {
        idUsuario: userData.idUsuario,
        usuario: userData.usuario,
        nombre: userData.nombreUsuario,
        apellido: userData.apellidoUsuario,
        telefono: userData.telefonoUsuario,
        correo: userData.correoUsuario,
        idRol: userData.idRol,
        rol: userData.nombreRol,
        estadoUsuario: userData.estadoUsuario
      },
      permisos: userPermisos.map((permiso) => ({
        idPermiso: permiso.idPermiso,
        nombrePermiso: permiso.nombrePermiso,
        rutaAcceso: permiso.rutaAcceso,
      })),
      contrasena: userData.contrasena, // Incluir la contraseña hasheada para validación en el servicio
    };
    return response;
  } catch (error) {
    throw new CustomError(getDatabaseError(error.message));
  }
};
