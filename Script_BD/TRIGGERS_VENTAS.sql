CREATE TRIGGER IF NOT EXISTS actualizar_totalVenta_insert
AFTER INSERT ON DETALLESVENTAS
BEGIN
    UPDATE VENTAS
    SET totalVenta = (
        SELECT SUM(subtotal)
        FROM DETALLESVENTAS
        WHERE idVenta = NEW.idVenta
    )
    WHERE idVenta = NEW.idVenta;
END;

CREATE TRIGGER IF NOT EXISTS actualizar_totalVenta_insert
AFTER INSERT ON DETALLESVENTAS
BEGIN
    UPDATE VENTAS
    SET totalVenta = (
        SELECT SUM(subtotal)
        FROM DETALLESVENTAS
        WHERE idVenta = NEW.idVenta
    )
    WHERE idVenta = NEW.idVenta;
END;

CREATE TRIGGER IF NOT EXISTS actualizar_totalVenta_delete
AFTER DELETE ON DETALLESVENTAS
BEGIN
    UPDATE VENTAS
    SET totalVenta = (
        SELECT SUM(subtotal)
        FROM DETALLESVENTAS
        WHERE idVenta = OLD.idVenta
    )
    WHERE idVenta = OLD.idVenta;
END;