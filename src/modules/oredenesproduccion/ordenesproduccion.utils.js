import { consultarCantidadUnidadesService } from "../OrdenesProdConfig/ordenesprodconfig.service.js";


const calcularUnidadesTotales = (cantidadBase, cantidadBandejas) => {
    return cantidadBase * cantidadBandejas;
};
  

export const procesarDetallesOrden = async (detalles) => {
  return Promise.all(
    detalles.map(async (detalle) => {
      // Solo procesamos bandejas
      if (detalle.tipoProduccion === "bandejas") {
        const cantidadBase = await consultarCantidadUnidadesService(detalle.idProducto);
        return {
          ...detalle,
          cantidadUnidades: detalle.idCategoria === 1 ?
            calcularUnidadesTotales(cantidadBase, detalle.cantidadBandejas)
            : detalle.cantidadUnidades
        };
      }
      
      // Para otros tipos de producción, devolver el detalle sin cambios
      return detalle;
    })
  );
};