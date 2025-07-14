import { consultarDataDashboardService } from "./dashboardData.service.js";

export const consultarDataDashboardController = async (req, res, next) => {
    try {
      const dataDashboard = await consultarDataDashboardService();
      const responseData = {
        status: 200,
        message: "Consulta exitosa",
        dataDashboard
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  }