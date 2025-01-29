import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const consultarRolesPermisosDao = async () => {
  try {
    const query = "SELECT * FROM rolespermisos";
    const result = await Connection.execute(query);

    return result.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const ingresarRolPermisoDao = async (dataRolPermiso) => {
  try {
    const query =
      "INSERT INTO rolespermisos (idRol, idPermiso) VALUES (?, ?)";
    const result = await Connection.execute(query, [
      dataRolPermiso.idRol,
      dataRolPermiso.idPermiso,
    ]);

    return result.toJSON().lastInsertRowid;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarRolPermisoDao = async (dataRolPermiso) => {
  try {
    const query =
      "UPDATE rolespermisos SET idRol = ?, idPermiso = ? WHERE idRolPermiso = ?";
    const result = await Connection.execute(query, [
      dataRolPermiso.idRol,
      dataRolPermiso.idPermiso,
      dataRolPermiso.idRolPermiso,
    ]);

    return result.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const eliminarRolPermisoDao = async (idRolPermiso) => {
  try {
    const query = "DELETE FROM ROLESPERMISOS WHERE idRol = ?";
    const result = await Connection.execute(query, [idRolPermiso]);
    
    return result.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const consultarPermisosPorRolDao = async () => {
    try {
        const query = `SELECT R.idRol, R.nombreRol, R.descripcionRol, P.idPermiso,
                        P.nombrePermiso, P.descripcionPermiso, P.rutaAcceso
                        FROM  ROLESPERMISOS RP
                        INNER JOIN ROLES R ON RP.idRol = R.idRol
                        INNER JOIN PERMISOS P ON RP.idPermiso = P.idPermiso
                        WHERE R.estado = 'A' AND P.estado = 'A'
                        ORDER BY R.idRol, P.nombrePermiso;
                    `;

        const result = await Connection.execute(query);
    
        return result.rows;
    } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
    }
}


export const ingresarRolesPermisosBatchDao = async (dataRolesPermisos) => {
  try {
    // Validar que dataRolesPermisos sea un array
    if (!Array.isArray(dataRolesPermisos) || dataRolesPermisos.length === 0) {
      throw new Error("El parámetro dataRolesPermisos debe ser un array no vacío.");
    }

    // Crear la consulta base
    const query = "INSERT INTO rolespermisos (idRol, idPermiso) VALUES (?, ?)";

    // Generar las consultas en batch
    const batch = dataRolesPermisos.map((rolPermiso) => ({
      sql: query,
      args: [rolPermiso.idRol, rolPermiso.idPermiso],
    }));

    // Ejecutar las consultas en una transacción
    const result = await Connection.batch(batch);

    return result.length;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};


export const consultarRolesPermisosPorIdDao = async (id) => {
  try {
    const queryRoles = `select idRol, nombreRol, descripcionRol from roles 
                        where idRol = ?; `;
    const resultRol = await Connection.execute(queryRoles, [id] );

    const queryPermisos = `select idPermiso from ROLESPERMISOS
                          where idRol = ?;`;

    const resultPermisos = await Connection.execute(queryPermisos, [id] );

    const result = {
      rolesPermisos: resultRol.rows.map(rol => ({
        ...rol,
        permisos: resultPermisos.rows.map(permiso => permiso.idPermiso) // Asigna los permisos al rol
      }))
    };

    
    return result.rolesPermisos[0];
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}


export const eliminarRolesPermisosBatchDao = async (dataRolesPermisos) => {
  try {
    // Validar que dataRolesPermisos sea un array
    if (!Array.isArray(dataRolesPermisos) || dataRolesPermisos.length === 0) {
      throw new Error("El parámetro dataRolesPermisos debe ser un array no vacío.");
    }

    // Crear la consulta base
    const query = "DELETE FROM ROLESPERMISOS WHERE idRol = ? and idPermiso = ?;";

    // Generar las consultas en batch
    const batch = dataRolesPermisos.map((rolPermiso) => ({
      sql: query,
      args: [rolPermiso.idRol, rolPermiso.idPermiso],
    }));

    // Ejecutar las consultas en una transacción
    const result = await Connection.batch(batch);

    return result.length;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};