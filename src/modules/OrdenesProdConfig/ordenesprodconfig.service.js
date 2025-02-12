import { consultarCantidadUnidadesDao } from "./ordenesprodconfig.dao.js";


export const consultarCantidadUnidadesService = async (idProducto) => {
  try {
    const unidadesPorBandeja = await consultarCantidadUnidadesDao(idProducto);

    return unidadesPorBandeja;
  } catch (error) {
    throw error;
  }
};
