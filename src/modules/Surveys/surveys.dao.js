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
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const crearCampaniaDao = async (data) => {
  try{
    const {preguntas} = data;
    const insertCampania = `INSERT INTO campanias(nombreCampania, descripcion, idUsuarioCreo, fechaInicio, fechaFin, tipoEncuesta, urlEncuesta, fechaCreacion, fechaActualizacion) 
                            VALUES 
                            (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    
    const resInserCampania = await Connection.execute(insertCampania, [
      data.nombreCampania,
      data.descripcion,
      data.idUsuarioCreo,
      data.fechaInicio,
      data.fechaFin,
      data.tipoEncuesta,
      data.urlEncuesta,
      data.fechaCreacion,
      data.fechaActualizacion
    ]);

    const idCampania = resInserCampania.toJSON().lastInsertRowid;

    if(!idCampania){
      return 0;
    }

    const insertPreguntas = `INSERT INTO preguntas_campania(idCampania, tipo, pregunta, orden, obligatoria, fechaCreacion) 
                              VALUES (?, ?, ?, ?, ?, ?);`;
    
    const resInsertPregutas = preguntas.map((pregunta) => ({
      sql: insertPreguntas,
      args: [
        idCampania,
        pregunta.tipo,
        pregunta.pregunta,
        pregunta.orden,
        pregunta.obligatoria,
        pregunta.fechaCreacion
      ]

    }));

    const resBatch = await Connection.batch(resInsertPregutas)
    
    return idCampania;

  }catch(error){
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const consultarEncuestasDao = async () => {
  try {
    const query = `SELECT 
                        c.idCampania as id,
                        c.nombreCampania as title,
                        c.descripcion,
                        CASE c.activa
                            WHEN 1 THEN 'active'
                            WHEN 0 THEN 'inactive'
                        END as status,
                        c.tipoEncuesta as type,
                        strftime('%Y-%m-%d', c.fechaCreacion) as created,
                        strftime('%Y-%m-%d', c.fechaInicio) as start_date,
                        strftime('%Y-%m-%d', c.fechaFin) as end_date,
                        c.urlEncuesta as survey_url,
                        -- Estadísticas
                        (SELECT COUNT(*) FROM preguntas_campania WHERE idCampania = c.idCampania AND estado = 'A') as questions,
                        (SELECT COUNT(*) FROM respuestas_cliente WHERE idCampania = c.idCampania AND estado = 'A') as responses,
                        -- Estado calculado basado en fechas
                        CASE 
                            WHEN c.activa = 0 THEN 'draft'
                            WHEN date('now') < c.fechaInicio THEN 'scheduled'
                            WHEN date('now') BETWEEN c.fechaInicio AND c.fechaFin THEN 'active'
                            WHEN date('now') > c.fechaFin THEN 'closed'
                            ELSE 'unknown'
                        END as calculated_status
                    FROM campanias c
                    WHERE c.estado = 'A'
                    ORDER BY c.fechaCreacion DESC;`;
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

export const consultarEncuestasListDao = async () => {
  try {
    const query = `SELECT 
                        c.idCampania as id,
                        c.nombreCampania as title,
                        c.descripcion,
                        CASE c.activa
                            WHEN 1 THEN 'active'
                            WHEN 0 THEN 'inactive'
                        END as status,
                        c.tipoEncuesta as type,
                        strftime('%Y-%m-%d', c.fechaCreacion) as created,
                        strftime('%Y-%m-%d', c.fechaInicio) as start_date,
                        strftime('%Y-%m-%d', c.fechaFin) as end_date,
                        c.urlEncuesta as survey_url,
                        -- Estadísticas
                        (SELECT COUNT(*) FROM preguntas_campania WHERE idCampania = c.idCampania AND estado = 'A') as questions,
                        (SELECT COUNT(*) FROM respuestas_cliente WHERE idCampania = c.idCampania AND estado = 'A') as responses,
                        -- Estado calculado basado en fechas
                        CASE 
                            WHEN c.activa = 0 THEN 'draft'
                            WHEN date('now') < c.fechaInicio THEN 'scheduled'
                            WHEN date('now') BETWEEN c.fechaInicio AND c.fechaFin THEN 'active'
                            WHEN date('now') > c.fechaFin THEN 'closed'
                            ELSE 'unknown'
                        END as calculated_status
                    FROM campanias c
                    WHERE c.estado = 'A'
                    ORDER BY c.fechaCreacion DESC;`;
    const result = await Connection.execute(query);

    if (result.rows.length === 0) {
      return 0;
    }

    return result.rows;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const elminarEncuestaDao = async (idCampania) => {
  try {
    const query = `delete from campanias where idCampania = ?`;
    const result = await Connection.execute(query, [idCampania]);
    
    return result;
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}

export const consultarEncuestaDetalleDao = async (idCampania) => {
  try {
    const queryCampania = `select c.idCampania, c.nombreCampania, c.descripcion, u.usuario, c.fechaInicio, c.fechaFin, c.activa
                              from campanias c
                            inner join usuarios u on c.idUsuarioCreo = u.idUsuario
                            where idCampania = ?;`;

    const result = await Connection.execute(queryCampania, [idCampania]);

    const queryPreguntas = `select p.idPregunta, p.tipo, p.pregunta
                            from preguntas_campania p
                            where p.idCampania = ? and p.estado = 'A'
                            order by p.orden;`;
    
    const preguntasResult = await Connection.execute(queryPreguntas, [idCampania]);
    
    return {
      detalle: result.rows[0],
      preguntas: preguntasResult.rows
    };
  } catch (error) {
    const dbError = getDatabaseError(error.message);
    throw new CustomError(dbError);
  }
}