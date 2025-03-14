
export const calcularStockActualizado = (existencias, nuevoIngreso) => {
    const nuevoStock = existencias + nuevoIngreso;
    return nuevoStock;
}

export const payloadStockProductoInexistente = (stockProducto) => {
    const payload = {
        ...stockProducto,
        cantidad: stockProducto.stock,
        stockAnterior: 0,
        stockNuevo: stockProducto.stock,
    };
    
    return payload;
}

export const payloadStockProductoExistente = (productoExistente, stockProducto) => {
    
    const nuevoStock = calcularStockActualizado(productoExistente.stock, stockProducto.stock);

    const payload = {
        idStock: productoExistente.idStock,
        ...stockProducto,
        stock: nuevoStock,
        cantidad: stockProducto.stock,
        stockAnterior: productoExistente.stock,
        stockNuevo: nuevoStock,
    };
    
    return payload;
}

