import { consultarRecetaService } from "../recetas/recetas.service.js";

export const CalcularCantidadIngredientes = async (detalleOrden) => {
  const payload = []; // Array para almacenar el payload final

  // Recorremos cada detalle de la orden
  for (const detalle of detalleOrden.detallesOrden) {
    // Consultamos la receta del producto
    const receta = await consultarRecetaService(detalle.idProducto);

    // Si la receta no tiene ingredientes (array vacío o 0), continuamos con el siguiente detalle
    if (!receta || receta.length === 0) {
      continue;
    }

    // Procesamos cada ingrediente de la receta
    for (const ingrediente of receta) {
      // Calculamos la cantidad usada
      const cantidadUsada = parseFloat(
        (ingrediente.cantidadNecesaria * detalle.cantidadUnidades).toFixed(2)
      );

      // Construimos el objeto para el payload
      const detalleConsumo = {
        idDetalleOrdenProduccion: detalle.idDetalleOrdenProduccion, // Correctly access idDetalleOrdenProduccion
        idIngrediente: ingrediente.idIngrediente,
        cantidadUsada: cantidadUsada,
        unidadMedida: ingrediente.unidadMedida,
        fechaCreacion: detalle.fechaCreacion,
      };

      // Agregamos el objeto al payload
      payload.push(detalleConsumo);
    }
  }

  // Retornamos el payload final
  return payload;
};