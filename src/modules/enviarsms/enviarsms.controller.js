import sendSMS from "./enviarsms.service.js";


export const sendSMSController = async (req, res, next) => {
    try {
      const sms = await sendSMS(req.body);
      const responseData = {
        status: 200,
        message: "Creacion de usuario existosa",
        idUsuario: sms,
      };
      res.status(200).json(responseData);
    } catch (error) {
      next(error); // Pasa el error al middleware de manejo de errores
    }
  };