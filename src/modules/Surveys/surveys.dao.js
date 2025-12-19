import { Connection } from "../../config/database/databaseSqlite.js";
import CustomError from "../../utils/CustomError.js";
import { getDatabaseError } from "../../utils/databaseErrors.js";

export const ConsultarCampaniaActivaDao = async (fechaHoy) => {
    try {
      const query = `SELECT idCampania, nombreCampania, descripcion, fechaInicio, fechaFin FROM campanias 
                      WHERE ? BETWEEN fechaInicio AND fechaFin
                      AND estado = 'A';`;
      const result = await Connection.execute(query, [fechaHoy]);

      if (result.rows.length === 0) {
        return 0;
      }
  
      return result.rows;
    } catch (error) {
      const dbError = getDatabaseError(error.message);
      throw new CustomError(dbError);
    }
}

export const consultarPregutasPorCampaniaDao = async (idCampania) =>{
  try{

    const query = `select idPregunta, idCampania, tipo, pregunta, orden, obligatoria, estado
                    from preguntas_campania
                    where idCampania = ?;`
    
    const resultQuery = await Connection.execute(query, [idCampania]);

    if(resultQuery.rows.length === 0){
      return 0;
    }

    return resultQuery.rows;
  }catch(erro){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const registrarRespuestasDao = async (data) =>{
  try{
    console.log(data.respuestas)
    const {usuario, respuestas} = data;
    const scriptResputas = `INSERT INTO respuestas_cliente (idCampania, nombreCliente, telefono, correo, fechaRespuesta)
                            VALUES (?, ?, ?, ?, ?);`;

    const resInsert = await Connection.execute(scriptResputas, [
      data.idCampania,
      usuario.nombre,
      usuario.telefono,
      usuario.correo,
      data.fechaRespuesta
    ])

    const idRespuesta = resInsert.toJSON().lastInsertRowid;

    if(!idRespuesta){
      return 0;
    }

    const scriptDetalle = `INSERT INTO detalle_respuestas (idRespuesta, idPregunta, respuesta, fechaCreacion)
                            VALUES (?, ?, ?, ?)`;
    
    const insertDetalleBatch = respuestas.map((respuesta) => ({
      sql: scriptDetalle,
      args: [
        idRespuesta,
        respuesta.idPregunta,
        respuesta.respuesta,
        data.fechaRespuesta
      ]

    }));

    const resBatch = await Connection.batch(insertDetalleBatch)
    
    return {
      idRespuesta
    };
  }catch(error){
    console.log(error)
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

