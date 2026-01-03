DROP TABLE IF EXISTS GASTOSDIARIOS;
DROP TABLE IF EXISTS GASTOSDIARIOSDETALLES;
DROP TABLE IF EXISTS TRASLADOSPRODUCTOS;
DROP TABLE IF EXISTS TRASLADOSPRODUCTOSDETALLES;
DROP TABLE IF EXISTS ELIMINACIONESDIARIAS;
DROP TABLE IF EXISTS VENTASELIMINADAS;
DROP TABLE IF EXISTS DETALLESVENTASELIMINADAS;
DROP TABLE IF EXISTS SOBRANTES;

CREATE TABLE IF NOT EXISTS GASTOSDIARIOS (
    idGastoDiario INTEGER PRIMARY KEY AUTOINCREMENT,
    idVenta INTEGER,
    idUsuario INTEGER,
    montoTotalGasto DECIMAL(10, 2) NOT NULL,
    fechaIngreso DATETIME,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idVenta) REFERENCES VENTAS(idVenta) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario)
); 

CREATE TABLE IF NOT EXISTS GASTOSDIARIOSDETALLES (
    idGastoDiarioDetalle INTEGER PRIMARY KEY AUTOINCREMENT,
    idGastoDiario INTEGER,
    detalleGasto TEXT,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (idGastoDiario) REFERENCES GASTOSDIARIOS(idGastoDiario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS TRASLADOSPRODUCTOS (
    idTraslado INTEGER PRIMARY KEY AUTOINCREMENT,
    idSucursalOrigen INTEGER,
    idSucursalDestino INTEGER,
    idUsuario INTEGER,
    fechaTraslado DATETIME,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idSucursalOrigen) REFERENCES SUCURSALES(idSucursal) ON DELETE CASCADE,
    FOREIGN KEY (idSucursalDestino) REFERENCES SUCURSALES(idSucursal) ON DELETE CASCADE,
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario)
); 

CREATE TABLE IF NOT EXISTS TRASLADOSPRODUCTOSDETALLES (
    idTrasladoDetalle INTEGER PRIMARY KEY AUTOINCREMENT,
    idTraslado INTEGER,
    idProducto INTEGER,
    cantidadATrasladar INTEGER NOT NULL,
    FOREIGN KEY (idTraslado) REFERENCES TRASLADOSPRODUCTOS(idTraslado) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS ELIMINACIONESDIARIAS (
    idEliminacionDiaria INTEGER PRIMARY KEY AUTOINCREMENT,
    procesoEliminado TEXT NOT NULL,
    idReferencia INTEGER,
    idUsuario INTEGER,
    idSucursal INTEGER,
    turno TEXT NULL CHECK(turno IN ('AM', 'PM')) DEFAULT 'AM',
    fechaEliminacion DATETIME,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario),
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal)
);

CREATE TABLE IF NOT EXISTS VENTASELIMINADAS(
    idEliminacion INTEGER PRIMARY KEY AUTOINCREMENT,
    idVenta INTEGER,
    idUsuario INTEGER,
    idSucursal INTEGER,
    turno TEXT NULL CHECK(turno IN ('AM', 'PM')) DEFAULT 'AM',
    montoTotalIngresado DECIMAL(10, 2) NOT NULL,
    montoTotalGastos DECIMAL(10, 2) NOT NULL,
    montoEsperado DECIMAL(10, 2) NOT NULL,
    diferencia DECIMAL(10, 2),
    fechaEliminacion DATETIME,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario),
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal)
);


-- Crear la tabla DETALLESVENTASELIMINADAS (Detalles de la Venta Eliminada)
CREATE TABLE IF NOT EXISTS DETALLESVENTASELIMINADAS (
    idDetalleEliminacion INTEGER PRIMARY KEY AUTOINCREMENT,  -- Identificador único del detalle
    idEliminacion INTEGER NOT NULL,                       -- Identificador de la eliminación diaria
    idProducto INTEGER NOT NULL,                                -- Identificador del producto vendido
    cantidadVendidaEliminada INTEGER NOT NULL,                  -- Cantidad vendida del producto
    precioUnitario DECIMAL(10, 2) NOT NULL,                     -- Precio unitario al momento de la venta
    descuento DECIMAL(10, 2) DEFAULT 0.00,                      -- Descuento aplicado al producto
    subtotal DECIMAL(10, 2),                                    -- Subtotal calculado
    FOREIGN KEY (idEliminacion) REFERENCES VENTASELIMINADAS(idEliminacion) ON DELETE CASCADE  -- Integridad referencial corregida
);


-- Crear la tabla SOBRANTES aara guardar los sobrantes de los productos
CREATE TABLE IF NOT EXISTS SOBRANTES (
    idSobrante INTEGER PRIMARY KEY AUTOINCREMENT,  -- Identificador único del detalle
    idVenta INTEGER NOT NULL,                         -- Identificador de la venta
    idProducto INTEGER NOT NULL,                      -- Identificador del producto vendido
    unidadesSobrantes INTEGER NOT NULL,                 -- Cantidad vendida del producto
    FOREIGN KEY (idVenta) REFERENCES VENTAS(idVenta) ON DELETE CASCADE,  -- Integridad referencial con la tabla de ventas
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto)  -- Integridad referencial con la tabla de productos
);

-- ELIMINAR tablas en orden inverso (de más dependiente a menos)
DROP TABLE IF EXISTS detalle_respuestas;
DROP TABLE IF EXISTS respuestas_cliente;
DROP TABLE IF EXISTS preguntas_campania;
DROP TABLE IF EXISTS campanias;

-- CREAR tablas en orden (de menos dependiente a más)
CREATE TABLE IF NOT EXISTS campanias(
    idCampania INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCampania TEXT NOT NULL,
    descripcion TEXT,
    idUsuarioCreo INTEGER,
    fechaInicio DATETIME,
    fechaFin DATETIME,
    activa INTEGER NOT NULL CHECK(activa IN (0, 1)) DEFAULT 1,
    tipoEncuesta TEXT,
    urlEncuesta TEXT,
    fechaCreacion DATETIME ,
    fechaActualizacion DATETIME,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

CREATE TABLE IF NOT EXISTS preguntas_campania(
    idPregunta INTEGER PRIMARY KEY AUTOINCREMENT,
    idCampania INTEGER NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('pregunta', 'texto')),
    pregunta TEXT NOT NULL,
    orden INTEGER NOT NULL DEFAULT 1,
    obligatoria INTEGER NOT NULL CHECK(obligatoria IN (0, 1)) DEFAULT 1,
    fechaCreacion DATETIME,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idCampania) REFERENCES campanias(idCampania) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS respuestas_cliente(
    idRespuesta INTEGER PRIMARY KEY AUTOINCREMENT,
    idCampania INTEGER NOT NULL,
    nombreCliente TEXT,
    telefono TEXT,
    correo TEXT,
    nombreVendedor TEXT,
    idSucursal INTEGER,
    fechaRespuesta DATETIME,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idCampania) REFERENCES campanias(idCampania) ON DELETE CASCADE,
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal)
);

CREATE TABLE IF NOT EXISTS detalle_respuestas(
    idDetalle INTEGER PRIMARY KEY AUTOINCREMENT,
    idRespuesta INTEGER NOT NULL,
    idPregunta INTEGER NOT NULL,
    respuesta TEXT NOT NULL,
    fechaCreacion DATETIME,
    FOREIGN KEY (idRespuesta) REFERENCES respuestas_cliente(idRespuesta) ON DELETE CASCADE,
    FOREIGN KEY (idPregunta) REFERENCES preguntas_campania(idPregunta) ON DELETE CASCADE
);