
const descontarStock = (cantidadExistente, cantidadADescontar) => {
    return cantidadExistente - cantidadADescontar;
}

export const crearPayloadDescontarStockDiario = (descuentoInfo, productoIngresado, productoEnStock) => {
    
    const payloadDescontarDiario = {
        idProducto: productoIngresado.idProducto,
        idSucursal: descuentoInfo.idSucursal,
        stock: productoEnStock.stock - productoIngresado.stockADescontar,
        fechaActualizacion: productoIngresado.fechaDescuento,
        fechaValidez: descuentoInfo.fechaCreacion,
    }

    return payloadDescontarDiario;
}

export const crearPayloadDescontarStockGeneral = (descuentoInfo, productoIngresado, productoEnStock) => {
    const payloadDescontarGeneral = {
        idProducto: productoIngresado.idProducto,
        idSucursal: descuentoInfo.idSucursal,
        stock: productoEnStock.stock - productoIngresado.stockADescontar,
        fechaActualizacion: productoIngresado.fechaDescuento,
    }

    return payloadDescontarGeneral;  
}

export const crearPayloadHistorialStock = (descuentoInfo, productoIngresado, productoEnStock) => {
    const payloadHistorial = {
        idUsuario: descuentoInfo.idUsuario,
        idProducto: productoIngresado.idProducto,
        idSucursal: descuentoInfo.idSucursal,
        tipoMovimiento: 'EGRESO',
        stockAnterior: productoEnStock.stock,
        stockNuevo: productoEnStock.stock - productoIngresado.stockADescontar,
        cantidad: productoIngresado.stockADescontar,
        fechaActualizacion: descuentoInfo.fechaDescuento,
        observaciones: descuentoInfo.tipoDescuento === "MAYOREO" ? 'Descuento por venta al mayoreo' : "Descuento por producto en mal estado",
        tipoReferencia: 'DESCUENTO-'
    }

    return payloadHistorial;
}
