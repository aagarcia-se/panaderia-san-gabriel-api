import hashPassword from "../../auth/hashPassword.js";
import CustomError from "../../utils/CustomError.js";
import { getError } from "../../utils/generalErrors.js";
import { enviarEmail } from "../emails/enviarcorresos.service.js";
import generarPlantillaCreacionUsuario from "../emails/plantillasenviarcorreo/notiCreacionUsuario.js";
import { actualizarUsuarioDao, consultarUsuariosDao, crearUsuarioDao, bloquearUsuarioDao, elminarUsuarioDao, desbloquearUsuarioDao, cambiarPasswordDao } from "./usuarios.dao.js";
import { generaContrasena, generaNombreUsuario } from "./usuarios.utils.js";

export const crearUsuarioService = async (dataUsuario) => {
    try {  

      const usuario = generaNombreUsuario(dataUsuario);//Generar usuario
      const passGenerada = generaContrasena(); //Generar contraseña
      const hashedPass = await hashPassword.hashPassword(passGenerada);//Hasear contraseña
      
      const infoUsuario = {
        ...dataUsuario, 
        usuario, 
        contrasena: hashedPass,
        passGenerada
      }

      const userCreado = await crearUsuarioDao(infoUsuario);

      if (userCreado === 0) {
        const error = getError(2);
        throw new CustomError(error);
      }

      const dataCooreo = {
        correoDestino: dataUsuario.correoUsuario,
        asunto: "Notificacion creacion de usuario No-Replay",
      }

      const plantillaCorreo = generarPlantillaCreacionUsuario(usuario, passGenerada);
      await enviarEmail(dataCooreo, plantillaCorreo);
  
      return userCreado;
    } catch (error) {
      throw error;
    }
    
};

  export const consultarUsuariosService = async () => {
    try {
      const usuarios  = await consultarUsuariosDao();
  
      if (usuarios.length === 0) {
        const error = getError(1);
        throw new CustomError(error);
      }

  
      return usuarios;
    } catch (error) {
      throw error;
    }
  };

  export const actualizarUsuarioService = async (dataUsuario) => {
    try {
      const result = await actualizarUsuarioDao(dataUsuario);
      if (result === 0) {
        const error = getError(3);
        throw new CustomError(error);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };
  
  export const bloquearUsuarioService = async (idUsuario) => {
    try {
      const result = await bloquearUsuarioDao(idUsuario);
      if (result === 0) {
        const error = getError(4);
        throw new CustomError(error);
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const desbloquearUsuarioService = async (idUsuario) => {
    try {
      const result = await desbloquearUsuarioDao(idUsuario);
      if (result === 0) {
        const error = getError(4);
        throw new CustomError(error);
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const elminarUsuarioService = async (idUsuairo) => {
    try {
      const result = await elminarUsuarioDao(idUsuairo);
      if (result === 0) {
        const error = getError(4);
        throw new CustomError(error);
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  };

  export const cambiarPasswordService = async (newPassData) => {
    try {

      const hashedPass = await hashPassword.hashPassword(newPassData.contrasena);//Hasear contraseña
      newPassData.contrasena = hashedPass;

      const result = await cambiarPasswordDao(newPassData);
      if (result === 0) {
        const error = getError(3);
        throw new CustomError(error);
      }
      return result;
    } catch (error) {
      throw error;
    }
  };