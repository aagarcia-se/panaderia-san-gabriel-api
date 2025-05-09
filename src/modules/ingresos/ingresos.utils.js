

export const crearPayloadingresos = (idVenta, venta) => {
    const {encabezadoVenta, detalleIngreso, gastosDiarios} = venta;

   return {
        idVenta: Number(idVenta),
        ...detalleIngreso,
        montoEsperado: encabezadoVenta.totalVenta,
        montoTotalGasto:gastosDiarios.encabezadoGastosDiarios.montoTotalGasto
    }
}

export const calcularDiferencia = (montoEsperado, montoTotalIngresado, montoTotalGasto) => {

    return montoTotalIngresado - (montoEsperado + montoTotalGasto);

}