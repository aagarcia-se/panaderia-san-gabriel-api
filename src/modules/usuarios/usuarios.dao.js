import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const crearUsuarioDao = async (dataUser) => {
    try {
        const query =
          `INSERT INTO USUARIOS(nombreUsuario, apellidoUsuario, usuario, contrasena, correoUsuario, idRol, idSucursal, fechaCreacion) 
            values (?, ?, ?, ?, ?, ?, ?, ?);`;

        const resultUsuario = await Connection.execute(query, [
            dataUser.nombreUsuario, 
            dataUser.apellidoUsuario,
            dataUser.usuario,
            dataUser.contrasena,
            dataUser.correoUsuario,
            dataUser.idRol,
            dataUser.idSucursal,
            dataUser.fechaCreacion
        ]);
    
        return resultUsuario.toJSON().lastInsertRowid;
      } catch (error) {
        const dbError = getDatabaseError(error.message);
        throw new CustomError(dbError);
      }
}

export const consultarUsuariosDao = async () => {
  try {
    // Consulta SQL
    const query = `select u.idUsuario, concat(u.nombreUsuario, ' ', u.apellidoUsuario)nombreUsuario, u.usuario, u.telefonoUsuario, u.correoUsuario,
                   u.idRol, r.nombreRol, u.estadoUsuario, u.idSucursal, s.nombreSucursal 
                    from usuarios u, roles r, sucursales s
                    where u.idRol = r.idRol
                    and u.estado = 'A'
                    and u.idSucursal = s.idSucursal;`

    // Ejecutar la consulta
    const usuarios = await Connection.execute(query);

    // Devolver los registros encontrados
    return usuarios.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarUsuarioDao = async (dataUsuario) => {
  try {
    const query =
      "UPDATE usuarios SET nombreUsuario = ?, apellidoUsuario = ?, correoUsuario = ?, usuario = ? WHERE idUsuario = ?";
    const usuario = await Connection.execute(query, [
      dataUsuario.nombreUsuario,
      dataUsuario.apellidoUsuario,
      dataUsuario.correoUsuario,
      dataUsuario.usuario,
      dataUsuario.idUsuario
    ]);

    return usuario.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const bloquearUsuarioDao = async (idUsuario) => {
  try {
    const query =
      "UPDATE usuarios SET estadoUsuario = 'B' WHERE idUsuario = ?";
    const usuario = await Connection.execute(query, [idUsuario]);

    return usuario.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const desbloquearUsuarioDao = async (idUsuario) => {
  try {
    const query =
      "UPDATE usuarios SET estadoUsuario = 'A' WHERE idUsuario = ?";
    const usuario = await Connection.execute(query, [idUsuario]);

    return usuario.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const elminarUsuarioDao = async (idUsuario) => {
  try {
    const query =
      "UPDATE usuarios set estado = 'N' WHERE idUsuario = ?";
    const usuario = await Connection.execute(query, [idUsuario]);

    return usuario.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const cambiarPasswordDao = async (newPassData) => {
  try{

    const updataPassScript = `update usuarios set contrasena = ? 
                              where usuario = ?`;
  
    const resUpdate = await Connection.execute(updataPassScript, [
      newPassData.contrasena,
      newPassData.usuario,
    ]);

    return resUpdate.toJSON().rowsAffected;
  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const actualizarDatosUsuarioDao = async (dataUsuario) => {
  try {
    const query =
      "UPDATE usuarios SET nombreUsuario = ?, apellidoUsuario = ?, correoUsuario = ?, idRol = ?, idSucursal = ? WHERE idUsuario = ?";
    const usuario = await Connection.execute(query, [
      dataUsuario.nombreUsuario,
      dataUsuario.apellidoUsuario,
      dataUsuario.correoUsuario,
      dataUsuario.idRol,
      dataUsuario.idSucursal,
      dataUsuario.idUsuario
    ]);

    return usuario.toJSON().rowsAffected;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}