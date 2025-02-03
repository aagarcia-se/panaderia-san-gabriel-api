import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ingresarImgProductoDao = async (dataImagenProducto) => {
  try {
    const query = `insert into productosimagenes (idProducto, imagenB64, fechaCreacion) values 
                      (?, ?, ?);`;

    const idImagen = await Connection.execute(query, [
      dataImagenProducto.idProducto,
      dataImagenProducto.imagenB64,
      dataImagenProducto.fechaCreacion,
    ]);

    return idImagen.toJSON().lastInsertRowid;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
};

export const actualizarImgProductoDao = async (dataImagenProducto) => {
    try {
      const query = `udpate productosimagenes set idProducto = ?, imagenB64 = ?, fechaCreacion = ?
                    where idProducto = ?;`;
  
      const idImagen = await Connection.execute(query, [
        dataImagenProducto.idProducto,
        dataImagenProducto.imagenB64,
        dataImagenProducto.fechaCreacion,
      ]);
  
      return idImagen.toJSON().lastInsertRowid;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
  };

  export const eliminarImgProductoDao = async (idProducto) => {
    try {
      const query = `delete from productosimagenes where idProducto = ?;`;
  
      const idImagen = await Connection.execute(query, [idProducto]);
  
      return idImagen.toJSON().lastInsertRowid;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
  };