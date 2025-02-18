import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";

export const ingresarVentaService = async (ventas) => {
    try{
        
        const resVenta = await ingresarVentaDao(ventas);
        
        if(resVenta === 0){
            throw new CustomError(getError(2));
        }

        return resVenta;
    }catch(error){
        throw error;
    }
}

