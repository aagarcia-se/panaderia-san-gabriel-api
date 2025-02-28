--SUMAR STOCK
CREATE TRIGGER IF NOT EXISTS TR_ACTUALIZAR_STOCK_PRODUCCION
AFTER INSERT ON DETALLESORDENESPRODUCCION
FOR EACH ROW
WHEN (SELECT controlarStock FROM PRODUCTOS WHERE idProducto = NEW.idProducto) = 1 -- Solo si el producto requiere control de stock
BEGIN
    -- Actualiza el stock sumando la cantidad producida
    UPDATE STOCKPRODUCTOS
    SET stock = stock + NEW.cantidadUnidades,
        fechaActualizacion = CURRENT_TIMESTAMP
    WHERE 
        idProducto = NEW.idProducto 
        AND idSucursal = (SELECT idSucursal FROM ORDENESPRODUCCION WHERE idOrdenProduccion = NEW.idOrdenProduccion);

    -- Si no existe un registro, lo crea
    INSERT OR IGNORE INTO STOCKPRODUCTOS (idProducto, idSucursal, stock, fechaActualizacion, fechaCreacion)
    SELECT 
        NEW.idProducto, 
        idSucursal, 
        NEW.cantidadUnidades, 
        CURRENT_TIMESTAMP, 
        CURRENT_DATE
    FROM ORDENESPRODUCCION 
    WHERE idOrdenProduccion = NEW.idOrdenProduccion;
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