import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarIngresosDiariosPorTurnoDao } from "./ingresos.dao.js";
import { calcularDiferencia } from "./ingresos.utils.js";


export const registrarIngresoDiarioPorTurnoService = async (detalleingreso) =>{
    try{

        const diferencia =  calcularDiferencia(detalleingreso.montoEsperado, detalleingreso.montoTotalIngresado);

        const detalleIngresoConDiferencia = {
            ...detalleingreso, // Copiar todas las propiedades existentes
            diferencia: diferencia, // Agregar la diferencia calculada
        };

        // const idIngreso = await registrarIngresosDiariosPorTurnoDao(detalleIngresoConDiferencia);
        // if (idIngreso === 0) {
        //     throw new CustomError(getError(2));
        // }

        // return idIngreso;

    }catch(error){
        throw error;
    }
}