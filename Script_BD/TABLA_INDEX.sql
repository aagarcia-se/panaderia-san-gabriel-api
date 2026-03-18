-- ============================================================
-- ÍNDICES PARA TABLA VENTAS
-- ============================================================

-- El más importante: cubre el query de ventas por sucursal + rango de fecha
CREATE INDEX IF NOT EXISTS idx_ventas_sucursal_fecha 
    ON VENTAS (idSucursal, fechaVenta);

-- Cubre el mismo query pero también filtra por estadoVenta = 'C'
-- Evita tener que leer filas canceladas innecesariamente
CREATE INDEX IF NOT EXISTS idx_ventas_sucursal_fecha_estado 
    ON VENTAS (idSucursal, fechaVenta, estadoVenta);

-- Para reportes globales por rango de fecha sin filtrar por sucursal
CREATE INDEX IF NOT EXISTS idx_ventas_fecha 
    ON VENTAS (fechaVenta);

-- Para consultas por usuario (historial de cajero, auditoría)
CREATE INDEX IF NOT EXISTS idx_ventas_usuario 
    ON VENTAS (idUsuario);

-- ============================================================
-- ÍNDICES PARA TABLA DETALLESVENTAS
-- ============================================================

-- FK principal: acelera el JOIN con VENTAS
CREATE INDEX IF NOT EXISTS idx_detallesventas_idventa 
    ON DETALLESVENTAS (idVenta);

-- FK hacia PRODUCTOS: acelera el JOIN con PRODUCTOS
CREATE INDEX IF NOT EXISTS idx_detallesventas_idproducto 
    ON DETALLESVENTAS (idProducto);

-- Índice compuesto: útil para queries que filtran por venta Y producto
CREATE INDEX IF NOT EXISTS idx_detallesventas_venta_producto 
    ON DETALLESVENTAS (idVenta, idProducto);

-- ============================================================
-- ÍNDICES PARA TABLA PRODUCTOS
-- ============================================================

-- Filtra productos activos (estado = 'A') frecuentemente en JOINs
CREATE INDEX IF NOT EXISTS idx_productos_estado 
    ON PRODUCTOS (estado);

-- Para consultas por categoría
CREATE INDEX IF NOT EXISTS idx_productos_categoria 
    ON PRODUCTOS (idCategoria);

-- Compuesto: categoría + estado activo juntos
CREATE INDEX IF NOT EXISTS idx_productos_estado_categoria 
    ON PRODUCTOS (estado, idCategoria);