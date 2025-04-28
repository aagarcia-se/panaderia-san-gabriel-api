-- Eliminar las tablas si existen
DROP TABLE IF EXISTS ROLESPERMISOS;
DROP TABLE IF EXISTS PERMISOS;
DROP TABLE IF EXISTS ACCESOSUSUARIOS;
DROP TABLE IF EXISTS PRECIOS;
DROP TABLE IF EXISTS DETALLESORDENESPRODUCCION;
DROP TABLE IF EXISTS ORDENESPRODUCCION;
DROP TABLE IF EXISTS CONFIGORDEN;
DROP TABLE IF EXISTS CONSUMOSORDENESPRODUCCION;
DROP TABLE IF EXISTS RECETAS;
DROP TABLE IF EXISTS INGREDIENTES;
DROP TABLE IF EXISTS DETALLESVENTAS;
DROP TABLE IF EXISTS VENTAS;
DROP TABLE IF EXISTS STOCKPRODUCTOS;
DROP TABLE IF EXISTS STOCKPRODUCTOSDIARIOS;
DROP TABLE IF EXISTS HISTORIALSTOCK;
DROP TABLE IF EXISTS INGRESOSDIARIOS;
DROP TABLE IF EXISTS INGRESOSDIARIOS;
DROP TABLE IF EXISTS PRODUCTOS;
DROP TABLE IF EXISTS CATEGORIAS;
DROP TABLE IF EXISTS USUARIOS;
DROP TABLE IF EXISTS ROLES;
DROP TABLE IF EXISTS SUCURSALES;
DROP TABLE IF EXISTS ORDENESESPECIALES;
DROP TABLE IF EXISTS DETALLESORDENESESPECIALES;



-- Tabla SUCURSALES
CREATE TABLE IF NOT EXISTS SUCURSALES (
    idSucursal INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreSucursal TEXT NOT NULL,
    direccionSucursal TEXT,
    municipioSucursal TEXT,
    departamentoSucursal TEXT,
    latitudSucursal TEXT,
    longitudSucursal TEXT,
    telefonoSucursal TEXT,
    correoSucursal TEXT,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Tabla ROLES
CREATE TABLE IF NOT EXISTS ROLES (
    idRol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreRol TEXT NOT NULL UNIQUE,
    descripcionRol TEXT,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Tabla USUARIOS (Información general del usuario)
CREATE TABLE IF NOT EXISTS USUARIOS (
    idUsuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreUsuario TEXT NOT NULL,
    apellidoUsuario TEXT NOT NULL,
    usuario TEXT NOT NULL UNIQUE,
    contrasena TEXT NOT NULL,
    aliasUsuario TEXT,
    correoUsuario TEXT,
    telefonoUsuario TEXT,
    idRol INTEGER NOT NULL,
    estadoUsuario TEXT NOT NULL CHECK(estadoUsuario IN ('A', 'B')) DEFAULT 'A',
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idRol) REFERENCES ROLES(idRol)
);

-- Tabla ACCESOSUSUARIOS (Información de acceso y seguridad)
CREATE TABLE IF NOT EXISTS ACCESOSUSUARIOS (
    idAcceso INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario INTEGER NOT NULL,
    cambioContrasena INTEGER NOT NULL DEFAULT 0, -- 0 = falso, 1 = verdadero
    ultimaConexion DATETIME,
    intentosFallidos INTEGER DEFAULT 0,
    tokenRecuperacion TEXT,
    fechaExpiracionToken DATETIME,
    fechaCreacion DATE NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario) ON UPDATE CASCADE
);

-- Tabla PERMISOS
CREATE TABLE IF NOT EXISTS PERMISOS (
    idPermiso INTEGER PRIMARY KEY AUTOINCREMENT,
    nombrePermiso TEXT NOT NULL UNIQUE,
    descripcionPermiso TEXT,
    rutaAcceso TEXT,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Tabla ROLESPERMISOS
CREATE TABLE IF NOT EXISTS ROLESPERMISOS (
    idRol INTEGER NOT NULL,
    idPermiso INTEGER NOT NULL,
    PRIMARY KEY (idRol, idPermiso),
    FOREIGN KEY (idRol) REFERENCES ROLES(idRol) ON DELETE CASCADE,
    FOREIGN KEY (idPermiso) REFERENCES PERMISOS(idPermiso) ON DELETE CASCADE
);

-- Tabla CATEGORIAS
CREATE TABLE IF NOT EXISTS CATEGORIAS (
    idCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCategoria TEXT NOT NULL,
    descripcionCategoria TEXT,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Tabla PRODUCTOS
CREATE TABLE IF NOT EXISTS PRODUCTOS (
    idProducto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreProducto TEXT NOT NULL,
    idCategoria INTEGER NOT NULL,
    controlarStock INTEGER NOT NULL DEFAULT 1 CHECK(controlarStock IN (0, 1)), -- 0 = No controlar, 1 = Controlar,
    controlarStockDiario INTEGER NOT NULL DEFAULT 0 CHECK(controlarStockDiario IN (0, 1)), -- 0 = No controlar, 1 = Controlar,
    tipoProduccion TEXT NOT NULL DEFAULT "otros",  
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idCategoria) REFERENCES CATEGORIAS(idCategoria)
);

-- Tabla PRECIOS
CREATE TABLE PRECIOS (
    idPrecio INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    precioPorUnidad DECIMAL(10,2),
    fechaInicio DATE NOT NULL,
    fechaFin DATE CHECK (fechaFin > fechaInicio),
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto),
    CONSTRAINT unique_precio_producto_periodo UNIQUE (idProducto, fechaInicio, fechaFin)
);


-------- Tablas para control de ingreso--------------
------------- de ordenes a porudccion ---------------
-----------------------------------------------------
-----------------------------------------------------

-- Tabla CONFIGORDEN
CREATE TABLE IF NOT EXISTS CONFIGORDEN (
    idConfigOrden INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL UNIQUE,
    unidadesPorBandeja INTEGER NOT NULL,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto)
);

-- Tabla ORDENESPRODUCCION
CREATE TABLE IF NOT EXISTS ORDENESPRODUCCION (
    idOrdenProduccion INTEGER PRIMARY KEY AUTOINCREMENT,
    idSucursal INTEGER,
    ordenTurno TEXT NOT NULL, 
    nombrePanadero TEXT NOT NULL,
    fechaAProducir DATE NOT NULL,
    idUsuario INTEGER,
    estadoOrden TEXT NOT NULL CHECK(estadoOrden IN ('C', 'P')) DEFAULT 'P',
    fechaCierre DATE NULL CHECK (fechaCierre IS NULL OR fechaCierre >= fechaAProducir),
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario) ON DELETE SET NULL,
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal) ON DELETE SET NULL
);

-- Tabla DETALLESORDENESPRODUCCION
CREATE TABLE IF NOT EXISTS DETALLESORDENESPRODUCCION (
    idDetalleOrdenProduccion INTEGER PRIMARY KEY AUTOINCREMENT,
    idOrdenProduccion INTEGER NOT NULL,
    idProducto INTEGER NOT NULL,
    cantidadBandejas INTEGER NOT NULL,
    cantidadUnidades INTEGER NOT NULL,
    cantidadHarina INTEGER NOT NULL,
    fechaCreacion DATE NOT NULL,
    FOREIGN KEY (idOrdenProduccion) REFERENCES ORDENESPRODUCCION(idOrdenProduccion) ON DELETE CASCADE,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_productos_idCategoria ON PRODUCTOS(idCategoria);
CREATE INDEX idx_precios_idProducto ON PRECIOS(idProducto);
CREATE INDEX idx_usuarios_idRol ON USUARIOS(idRol);


--------tablas para control de materia prima---------
-----------------------------------------------------
-----------------------------------------------------

-- Crear tabla INGREDIENTES
CREATE TABLE IF NOT EXISTS INGREDIENTES (
    idIngrediente INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreIngrediente TEXT NOT NULL,
    unidadMedida TEXT NOT NULL, -- Unidad de medida base (kg, gr, litros, etc.)
    stockActual REAL NOT NULL, -- Cantidad actual del ingrediente en inventario
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Crear tabla RECETAS
CREATE TABLE IF NOT EXISTS RECETAS (
    idReceta INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL,
    idIngrediente INTEGER NOT NULL,
    cantidadNecesaria REAL NOT NULL, -- Cantidad de ingrediente necesaria para producir una unidad del producto
    unidadMedida TEXT NOT NULL DEFAULT 'Lb', -- Unidad de medida (kg, gr, litros, etc.)
    fechaCreacion DATE NOT NULL,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE,
    FOREIGN KEY (idIngrediente) REFERENCES INGREDIENTES(idIngrediente) ON DELETE CASCADE
);

-- Crear tabla CONSUMOSORDENESPRODUCCION
CREATE TABLE IF NOT EXISTS CONSUMOSORDENESPRODUCCION (
    idConsumoOrdenProduccion INTEGER PRIMARY KEY AUTOINCREMENT,
    idDetalleOrdenProduccion INTEGER NOT NULL,
    idIngrediente INTEGER NOT NULL,
    cantidadUsada REAL NOT NULL, -- Cantidad de ingrediente usada en esta orden
    unidadMedida TEXT NOT NULL, -- Unidad de medida (kg, gr, litros, etc.)
    fechaCreacion DATE NOT NULL,
    FOREIGN KEY (idDetalleOrdenProduccion) REFERENCES DETALLESORDENESPRODUCCION(idDetalleOrdenProduccion) ON DELETE CASCADE,
    FOREIGN KEY (idIngrediente) REFERENCES INGREDIENTES(idIngrediente) ON DELETE CASCADE
);


-------- Tablas para control de VENTAS --------------
-----------------------------------------------------
-----------------------------------------------------

-- Crear la tabla VEVTAS (Ventas)
CREATE TABLE IF NOT EXISTS VENTAS (
    idVenta INTEGER PRIMARY KEY AUTOINCREMENT,  -- Identificador único de la venta
    idUsuario INTEGER NOT NULL,                -- Identificador del usuario que realizó la venta
    idSucursal INTEGER NOT NULL,               -- Identificador de la sucursal donde se realizó la venta
    ventaTurno TEXT NOT NULL,                  -- TUrno de la venta registrada
    fechaVenta DATETIME NOT NULL,              -- Fecha y hora en que se realizó la venta
    totalVenta DECIMAL(10, 2),        -- Total de la venta en dinero
    estadoVenta TEXT NOT NULL CHECK(estadoVenta IN ('C', 'P')) DEFAULT 'C',                -- Estado de la venta (por ejemplo, "Completada", "Cancelada")
    fechaCreacion DATETIME NOT NULL,  -- Fecha de creación del registro de la venta
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario),  -- Integridad referencial con la tabla de usuarios
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal)  -- Integridad referencial con la tabla de sucursales
);

-- Crear la tabla DETALESVENTAS (Detalles de la Venta)
CREATE TABLE IF NOT EXISTS DETALLESVENTAS (
    idDetalleVenta INTEGER PRIMARY KEY AUTOINCREMENT,  -- Identificador único del detalle
    idVenta INTEGER NOT NULL,                         -- Identificador de la venta
    idProducto INTEGER NOT NULL,                      -- Identificador del producto vendido
    cantidadVendida INTEGER NOT NULL,                 -- Cantidad vendida del producto
    precioUnitario DECIMAL(10, 2) NOT NULL,           -- Precio unitario al momento de la venta
    descuento DECIMAL(10, 2) DEFAULT 0.00,            -- Descuento aplicado al producto
    subtotal DECIMAL(10, 2) ,  -- Subtotal calculado
    FOREIGN KEY (idVenta) REFERENCES VENTAS(idVenta) ON DELETE CASCADE,  -- Integridad referencial con la tabla de ventas
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto)  -- Integridad referencial con la tabla de productos
);


-------- Tablas para control stock ------------------
-----------------------------------------------------
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS STOCKPRODUCTOS (
    idStock INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL, 
    idSucursal INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    fechaActualizacion DATETIME NOT NULL,
    fechaCreacion DATETIME NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE,
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal) ON DELETE CASCADE
);


-- Tablas para control stock productos de diarios ---
-----------------------------------------------------
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS STOCKPRODUCTOSDIARIOS (
    idStockDiario INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL, 
    idSucursal INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    fechaValidez DATETIME NOT NULL DEFAULT CURRENT_DATE,
    fechaActualizacion DATETIME NOT NULL,
    fechaCreacion DATETIME NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE,
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal) ON DELETE CASCADE
);

-------- Tablas para control stock ------------------
-----------------------------------------------------
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS HISTORIALSTOCK (
    idHistorial INTEGER PRIMARY KEY AUTOINCREMENT, -- Identificador único del registro
    idUsuario INTEGER NOT NULL,                -- Identificador del usuario que realizó la venta
    idProducto INTEGER NOT NULL, -- ID del producto relacionado
    idSucursal INTEGER NOT NULL, -- ID de la sucursal relacionada
    tipoMovimiento TEXT NOT NULL CHECK(tipoMovimiento IN ('INGRESO', 'EGRESO', 'CORRECCION', 'AJUSTE')), -- Tipo de movimiento
    stockAnterior INTEGER NOT NULL, -- Stock antes del movimiento
    cantidad INTEGER NOT NULL, -- Cantidad afectada (positiva para ingresos, negativa para egresos)
    stockNuevo INTEGER NOT NULL, -- Stock después del movimiento
    fechaMovimiento DATETIME NOT NULL, -- Fecha y hora del movimiento
    observaciones TEXT, -- Detalles adicionales (opcional)
    tipoReferencia TEXT, -- Tipo de referencia (opcional, para indicar de dónde proviene el movimiento, como "VENTA", "ORDEN_PRODUCCION", etc.)
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N', 'P')) DEFAULT 'A', -- Estado del movimiento 
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario),  -- Integridad referencial con la tabla de usuarios
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE,
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal)
    
);

-------- Tablas para registro de ingresos------------
-----------------------------------------------------
-----------------------------------------------------
CREATE TABLE IF NOT EXISTS INGRESOSDIARIOS (
    idIngreso INTEGER PRIMARY KEY AUTOINCREMENT,
    idVenta INTEGER NOT NULL,
    montoTotalIngresado DECIMAL(10, 2) NOT NULL,
    montoEsperado DECIMAL(10, 2) NOT NULL,
    diferencia DECIMAL(10, 2),
    fechaIngreso DATE,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idVenta) REFERENCES VENTAS(idVenta) ON DELETE CASCADE
);


-------- Tablas para registro de ORDENES ESPECIALES------------
-----------------------------------------------------
-----------------------------------------------------
-- Tabla ORDENESESPECIALES
CREATE TABLE IF NOT EXISTS ORDENESESPECIALES (
    idOrdenEspecial INTEGER PRIMARY KEY AUTOINCREMENT,
    idSucursal INTEGER,
    idUsuario INTEGER,
    nombreCliente TEXT NOT NULL,
    telefonoCliente TEXT NOT NULL,
    fechaEntrega DATE NOT NULL,
    fechaAProducir DATE NOT NULL,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idSucursal) REFERENCES SUCURSALES(idSucursal) ON DELETE SET NULL
);

-- Tabla DETALLESORDENESESPECIALES
CREATE TABLE IF NOT EXISTS DETALLESORDENESESPECIALES (
    idDetalleOrdenEspecial INTEGER PRIMARY KEY AUTOINCREMENT,
    idOrdenEspecial INTEGER NOT NULL,
    idProducto INTEGER NOT NULL,
    cantidadUnidades INTEGER NOT NULL,
    fechaCreacion DATE NOT NULL,
    FOREIGN KEY (idOrdenEspecial) REFERENCES ORDENESESPECIALES(idOrdenEspecial) ON DELETE CASCADE,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE
);
