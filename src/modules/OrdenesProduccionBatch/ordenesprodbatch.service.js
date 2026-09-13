import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { parsearCSV } from "../../utils/ProcesarArchivos/csvParser.js";
import { ingresarOrdenProduccionServiceVersion2 } from "../oredenesproduccion/ordenesproduccion.service.js";
import { crearPayloadOrdenProduccionBatch } from "./ordenesprodbatch.utils.js";

export const ingresarOrdenProduccionBatchService = async (ordenHaader, csvString) => {
    try {
        console.log(ordenHaader)
        console.log(csvString)
        const registros = parsearCSV(csvString);
        const ordenProduccion = crearPayloadOrdenProduccionBatch(ordenHaader, registros);

         ordenProduccion.detalleOrden.map(producto => 
            console.log(producto)
        )
        console.log("------------------------------")
        const resultado = await ingresarOrdenProduccionServiceVersion2(ordenProduccion);

        console.log("resutaldo" + resultado)

        // 👈 validar aquí, antes de continuar
        if (resultado.idOrdenGenerada === 0) {
            const errorInfo = getError(2);
            throw new CustomError(errorInfo);
        }

        return resultado;
    } catch (error) {
        throw error;
    }
}