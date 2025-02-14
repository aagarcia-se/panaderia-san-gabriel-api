import { consultarConsumosOrdenesProduccionService } from "./consumosordenes.service.js";

export const consultarConsumosOrdenesProduccionController = async (req, res, next) => {
    try {
        const {idOrdenProduccion} = req.params;
        const IngredientesConsumidos = await consultarConsumosOrdenesProduccionService(idOrdenProduccion);
        const responseData = {
          status: 200,
          message: "Consulta exitosa",
          IngredientesConsumidos,
        };
        res.status(200).json(responseData);
      } catch (error) {
        next(error);
      }
}