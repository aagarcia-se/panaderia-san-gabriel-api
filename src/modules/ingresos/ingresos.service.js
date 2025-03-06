import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { registrarIngresosDiariosPorTurnoDao } from "./ingresos.dao.js";


export const registrarIngresoDiarioPorTurnoService = async (dataIngreso) =>{
    try{

        const idIngreso = await registrarIngresosDiariosPorTurnoDao(dataIngreso);
        if (idIngreso === 0) {
            throw new CustomError(getError(2));
        }

        return idIngreso;

    }catch(error){
        throw error;
    }
}