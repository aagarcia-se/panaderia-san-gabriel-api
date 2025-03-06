

export const crearPayloadingresos = (idVenta, venta) => {
    const {encabezadoVenta, detalleIngreso} = venta;

   return {
        idVenta: Number(idVenta),
        ...detalleIngreso,
        montoEsperado: encabezadoVenta.totalVenta,

    }
}

export const calcularDiferencia = (montoEsperado, montoTotalIngresado) => {

    return montoEsperado - montoTotalIngresado;

}