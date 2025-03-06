

export const crearPayloadingresos = (venta) => {
    const {encabezadoVenta, detalleIngreso} = venta;

   return {
        ...detalleIngreso,
        montoEsperado: encabezadoVenta.totalVenta 
    }
}

export const calcularDiferencia = (montoEsperado, montoTotalIngresado) => {

    return montoEsperado - montoTotalIngresado;

}