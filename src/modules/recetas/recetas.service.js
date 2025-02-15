import { consultarRecetaDao } from "./recetas.dao.js";



export const consultarRecetaService = async (idProducto) => {
    try {      
        
        const receta = await consultarRecetaDao(idProducto);
  
      return receta;
    } catch (error) {
      throw error;
    }
  };
  