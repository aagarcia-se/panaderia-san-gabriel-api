import CustomError from "../../utils/CustomError";
import { getError } from "../../utils/generalErrors";
import { consultarUnidadesDeProductoPorOrdenService } from "../oredenesproduccion/ordenesproduccion.service";

const calcularUnidadesDePanaderiaVendidas = (unidadesProducidas, unidadesNoVendidas) => {
    if (unidadesNoVendidas > unidadesProducidas) {
        throw new CustomError(getError(18));
    }
    return unidadesProducidas - unidadesNoVendidas;
}

export const calcularUnidadesVendidasPorProducto = (ventaDetalle) => {
    return Promise.all(
        ventaDetalle.map(async (detalle) => {
            const productoProducido = await consultarUnidadesDeProductoPorOrdenService(detalle.idProducto);
            return {
                ...detalle,
                cantidadVendida: calcularUnidadesDePanaderiaVendidas(productoProducido.cantidadUnidades, detalle.unidadesNoVendidas)
            };
        })
    );
}
