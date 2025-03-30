-- --SUMAR STOCK
-- CREATE TRIGGER IF NOT EXISTS TR_ACTUALIZAR_STOCK_PRODUCCION
-- AFTER INSERT ON DETALLESORDENESPRODUCCION
-- FOR EACH ROW
-- WHEN (SELECT controlarStock FROM PRODUCTOS WHERE idProducto = NEW.idProducto) = 1 -- Solo si el producto requiere control de stock
-- BEGIN
--     -- Actualiza el stock sumando la cantidad producida
--     UPDATE STOCKPRODUCTOS
--     SET stock = stock + NEW.cantidadUnidades,
--         fechaActualizacion = CURRENT_TIMESTAMP
--     WHERE 
--         idProducto = NEW.idProducto 
--         AND idSucursal = (SELECT idSucursal FROM ORDENESPRODUCCION WHERE idOrdenProduccion = NEW.idOrdenProduccion);

--     -- Si no existe un registro, lo crea
--     INSERT OR IGNORE INTO STOCKPRODUCTOS (idProducto, idSucursal, stock, fechaActualizacion, fechaCreacion)
--     SELECT 
--         NEW.idProducto, 
--         idSucursal, 
--         NEW.cantidadUnidades, 
--         CURRENT_TIMESTAMP, 
--         CURRENT_DATE
--     FROM ORDENESPRODUCCION 
--     WHERE idOrdenProduccion = NEW.idOrdenProduccion;
-- END;

---- New trigger control de stock  ---
CREATE TRIGGER IF NOT EXISTS TR_ACTUALIZAR_STOCK_PRODUCCION
AFTER INSERT ON DETALLESORDENESPRODUCCION
FOR EACH ROW
BEGIN
    -- Caso 1: Bandejas con control de stock normal (STOCKPRODUCTOS)
    INSERT OR REPLACE INTO STOCKPRODUCTOS 
        (idProducto, idSucursal, stock, fechaActualizacion, fechaCreacion)
    SELECT 
        NEW.idProducto,
        o.idSucursal,
        COALESCE(
            (SELECT sp.stock FROM STOCKPRODUCTOS sp
             WHERE sp.idProducto = NEW.idProducto AND sp.idSucursal = o.idSucursal),
            0
        ) + NEW.cantidadUnidades,
        CURRENT_TIMESTAMP,
        COALESCE(
            (SELECT sp.fechaCreacion FROM STOCKPRODUCTOS sp
             WHERE sp.idProducto = NEW.idProducto AND sp.idSucursal = o.idSucursal),
            CURRENT_DATE
        )
    FROM ORDENESPRODUCCION o
    WHERE o.idOrdenProduccion = NEW.idOrdenProduccion
      AND (SELECT p.controlarStock FROM PRODUCTOS p WHERE p.idProducto = NEW.idProducto) = 1
      AND (SELECT p.tipoProduccion FROM PRODUCTOS p WHERE p.idProducto = NEW.idProducto) = 'bandejas';
    
    -- Caso 2: Bandejas con control de stock diario (STOCKPRODUCTOSDIARIOS)
    INSERT OR REPLACE INTO STOCKPRODUCTOSDIARIOS
        (idProducto, idSucursal, stock, fechaActualizacion, fechaCreacion, estado)
    SELECT 
        NEW.idProducto,
        o.idSucursal,
        COALESCE(
            (SELECT spd.stock FROM STOCKPRODUCTOSDIARIOS spd
             WHERE spd.idProducto = NEW.idProducto AND spd.idSucursal = o.idSucursal),
            0
        ) + NEW.cantidadUnidades,
        CURRENT_TIMESTAMP,
        COALESCE(
            (SELECT spd.fechaCreacion FROM STOCKPRODUCTOSDIARIOS spd
             WHERE spd.idProducto = NEW.idProducto AND spd.idSucursal = o.idSucursal),
            CURRENT_DATE
        ),
        'A'
    FROM ORDENESPRODUCCION o
    WHERE o.idOrdenProduccion = NEW.idOrdenProduccion
      AND (SELECT p.controlarStock FROM PRODUCTOS p WHERE p.idProducto = NEW.idProducto) = 0
      AND (SELECT p.controlarStockDiario FROM PRODUCTOS p WHERE p.idProducto = NEW.idProducto) = 1
      AND (SELECT p.tipoProduccion FROM PRODUCTOS p WHERE p.idProducto = NEW.idProducto) = 'bandejas';
END;

------------------RESTAR STOCK-----------------------
CREATE TRIGGER IF NOT EXISTS TR_ACTUALIZAR_STOCK_VENTA
AFTER INSERT ON DETALLESVENTAS
FOR EACH ROW
WHEN (SELECT controlarStock FROM PRODUCTOS WHERE idProducto = NEW.idProducto) = 1 -- Solo si el producto requiere control de stock
BEGIN
    -- Actualiza el stock restando la cantidad vendida
    UPDATE STOCKPRODUCTOS
    SET stock = stock - NEW.cantidadVendida,
        fechaActualizacion = CURRENT_TIMESTAMP
    WHERE 
        idProducto = NEW.idProducto 
        AND idSucursal = (SELECT idSucursal FROM VENTAS WHERE idVenta = NEW.idVenta);
END;