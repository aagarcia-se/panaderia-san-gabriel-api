/**
 * Agrupa los registros de pérdidas por producto
 * @param {Array} datos - Array de registros de pérdidas
 * @returns {Array} Array de objetos agrupados por producto
 */
export const agruparPorProducto = (datos) => {
    // Crear un objeto para agrupar por idProducto
    const agrupado = {};

    datos.forEach(registro => {
        const { idProducto, nombreProducto, sucursal } = registro;

        // Si el producto no existe en el objeto, lo creamos
        if (!agrupado[idProducto]) {
            agrupado[idProducto] = {
                idProducto,
                nombreProducto,
                sucursal,
                fechaInicio: datos[0]?.fechaDescuento || null, // Primera fecha del reporte
                fechaFin: datos[datos.length - 1]?.fechaDescuento || null, // Última fecha del reporte
                totalUnidadesPerdidas: 0,
                totalDineroPerdido: 0,
                detalles: []
            };
        }

        // Agregar el registro al detalle
        agrupado[idProducto].detalles.push({
            idDescuento: registro.idDescuento,
            usuario: registro.usuario,
            turno: registro.turno,
            fechaDescuento: registro.fechaDescuento,
            unidadesPerdidas: registro.unidadesPerdidas,
            dineroPerdida: registro.dineroPerdida
        });

        // Acumular totales
        agrupado[idProducto].totalUnidadesPerdidas += registro.unidadesPerdidas;
        agrupado[idProducto].totalDineroPerdido += registro.dineroPerdida;
    });

    // Convertir el objeto a array y ordenar por producto
    return Object.values(agrupado).sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto));
}