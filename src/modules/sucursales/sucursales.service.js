import Sucursal from "./sucursal.model.js";
import CustomError from "../../utils/CustomError.js";
import { consultarSucursalesDao, ingresarSucursalDao, actualizarSucursalDao, eliminarSucursalDao } from "./sucursales.Dao.js";
import { getError } from "../../utils/generalErrors.js";

export const consultarSucursalesServices = async () => {
  try {
    const sucursalesData = await consultarSucursalesDao();

    if (sucursalesData.length === 0) {
      const error = getError(1);
      throw new CustomError(error);
    }

    const sucursales = sucursalesData.map(
      (sucursalesData) => new Sucursal(sucursalesData)
    );

    return sucursales;
  } catch (error) {
    throw new CustomError(error);
  }
};

export const ingresarSucursalServices = async (sucursal) => {
  try {
    const result = await ingresarSucursalDao(sucursal);

    if (result === 0) {
      const error = getError(2);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw new CustomError(error);
  }
};

export const actualizarSucursalServices = async (sucursalData) => {
  try {
    const sucursal = new Sucursal(sucursalData);

    const result = await actualizarSucursalDao(sucursal);

    if (result === 0) {
      const error = getError(3);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw new CustomError(error);
  }
};

export const eliminarSucursalServices = async (idSucursal) => {
  try {
    const sucursal = new Sucursal({ idSucursal });
    const result = await eliminarSucursalDao(sucursal.consultarIdSucursal());

    if (result === 0) {
      const error = getError(4);
      throw new CustomError(error);
    }

    return result;
  } catch (error) {
    throw new CustomError(error);
  }
};
