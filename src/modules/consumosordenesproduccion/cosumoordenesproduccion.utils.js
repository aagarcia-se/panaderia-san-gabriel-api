import { consultarRecetaService } from "../recetas/recetas.service.js";

export const CalcularCantidadIngredientes = async (detalleOrden) => {
  const payload = []; // Array para almacenar el payload final

  // Creamos un arreglo de promesas que incluye el índice original
  const promesas = detalleOrden.detallesOrden.map(async (detalle, index) => {
    // Consultamos la receta del producto
    const receta = await consultarRecetaService(detalle.idProducto);

    // Si la receta no tiene ingredientes (array vacío o 0), continuamos con el siguiente detalle
    if (receta.idReceta === 0) {
      return { index, detalleConsumo: null }; // Devolvemos null para este detalle
    }

    // Procesamos cada ingrediente de la receta
    const detallesConsumo = receta.map((ingrediente) => {
      // Calculamos la cantidad usada
      const cantidadUsada = parseFloat(
        (ingrediente.cantidadNecesaria * detalle.cantidadUnidades).toFixed(2)
      );

      // Construimos el objeto para el payload
      return {
        idDetalleOrdenProduccion: detalle.idDetalleOrdenProduccion,
        idIngrediente: ingrediente.idIngrediente,
        cantidadUsada: cantidadUsada,
        unidadMedida: ingrediente.unidadMedida,
        fechaCreacion: detalle.fechaCreacion,
      };
    });

    return { index, detalleConsumo: detallesConsumo };
  });

  // Esperamos a que todas las promesas se resuelvan
  const resultados = await Promise.all(promesas);

  // Ordenamos los resultados según el índice original
  resultados.sort((a, b) => a.index - b.index);

  // Procesamos los resultados en el orden correcto
  for (const resultado of resultados) {
    if (resultado.detalleConsumo) {
      payload.push(...resultado.detalleConsumo);
    }
  }

  // Retornamos el payload final ordenado por idDetalleOrdenProduccion
  return payload.sort((a, b) => a.idDetalleOrdenProduccion - b.idDetalleOrdenProduccion);
};