DROP TABLE IF EXISTS GASTOSDIARIOS;
DROP TABLE IF EXISTS GASTOSDIARIOSDETALLES;
DROP TABLE IF EXISTS TRASLADOSPRODUCTOS;
DROP TABLE IF EXISTS TRASLADOSPRODUCTOSDETALLES;
DROP TABLE IF EXISTS ELIMINACIONESDIARIAS;
DROP TABLE IF EXISTS DETALLESVENTASELMINADAS;

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

CREATE TABLE IF NOT EXISTS CAMPANIAS(
    idCampania INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCampania TEXT NOT NULL,
    descripcion TEXT,
    idUsuarioCreo INTEGER,
    fechaInicio DATETIME,
    fechaFin DATETIME,
    activa INTEGER NOT NULL CHECK(activa IN (0, 1)) DEFAULT 1,
    tipoEncuesta TEXT,
    urlEncuesta TEXT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

CREATE TABLE IF NOT EXISTS PREGUNTAS(
    idPregunta INTEGER PRIMARY KEY AUTOINCREMENT,
    idCampania INTEGER NOT NULL,
    typeResponse TEXT NOT NULL,
    pregunta TEXT,
    textoOpciones TEXT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idCampania) REFERENCES CAMPANIAS(idCampania)
);

CREATE TABLE IF NOT EXISTS RESPUESTAS(
    idRespuesta INTEGER PRIMARY KEY AUTOINCREMENT,
    idPregunta INTEGER NOT NULL,
    respuesta TEXT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaActualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idPregunta) REFERENCES PREGUNTAS(idPregunta)
);

-- Crear la tabla DETALESVENTAS (Detalles de la Venta)
CREATE TABLE IF NOT EXISTS DETALLESVENTASELMINADAS (
    idDetalleVentaEliminada INTEGER PRIMARY KEY AUTOINCREMENT,  -- Identificador único del detalle
    idVentaEliminada INTEGER NOT NULL,                         -- Identificador de la venta
    idProducto INTEGER NOT NULL,                      -- Identificador del producto vendido
    cantidadVendidaEliminada INTEGER NOT NULL,                 -- Cantidad vendida del producto
    precioUnitario DECIMAL(10, 2) NOT NULL,           -- Precio unitario al momento de la venta
    descuento DECIMAL(10, 2) DEFAULT 0.00,            -- Descuento aplicado al producto
    subtotal DECIMAL(10, 2) ,  -- Subtotal calculado
    FOREIGN KEY (idVenta) REFERENCES VENTAS(idVenta) ON DELETE CASCADE,  -- Integridad referencial con la tabla de ventas
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto)  -- Integridad referencial con la tabla de productos
);




