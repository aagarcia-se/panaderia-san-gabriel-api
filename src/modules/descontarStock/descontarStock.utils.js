
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

const crearMensajeObservaciones = (tipoDescuento) => {
    let message = '';

    if(tipoDescuento === "MAYOREO"){
        message = 'Descuento por venta al mayoreo';
    }else if(tipoDescuento === "MAL ESTADO"){
        message = "Descuento por producto en mal estado";
    }else if(tipoDescuento === "CORRECCION"){
        message = "Correccion de stock";
    }

    return message;
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
        observaciones: crearMensajeObservaciones(descuentoInfo.tipoDescuento),
        tipoReferencia: 'DESCUENTO-'
    }

    return payloadHistorial;
}


