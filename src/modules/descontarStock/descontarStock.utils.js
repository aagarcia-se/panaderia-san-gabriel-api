
const descontarStock = (cantidadExistente, cantidadADescontar) => {
    return cantidadExistente - cantidadADescontar;
}

export const crearPayloadDescontarStock = (stockExistente, stockADesontar) => {

    const payload = {
        stock: descontarStock(stockExistente.stock, stockADesontar.stockDescuento),
        fechaActualizacion: stockADesontar.fechaActualizacion,
        idProducto: stockADesontar.idProducto,
        idSucursal: stockADesontar.idSucursal
    }

    return payload;
}