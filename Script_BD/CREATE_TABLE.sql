-- Eliminar las tablas si existen
DROP TABLE IF EXISTS SUCURSALES;
DROP TABLE IF EXISTS ROLESPERMISOS;
DROP TABLE IF EXISTS PERMISOS;
DROP TABLE IF EXISTS USUARIOS;
DROP TABLE IF EXISTS ROLES;
DROP TABLE IF EXISTS ACCESOSUSUARIOS;
DROP TABLE IF EXISTS PRECIOS;
DROP TABLE IF EXISTS DETALLESORDENESPRODUCCION;
DROP TABLE IF EXISTS ORDENESPRODUCCION;
DROP TABLE IF EXISTS CONFIGPRODUCCION;
DROP TABLE IF EXISTS PRODUCTOS;
DROP TABLE IF EXISTS CATEGORIAS;
DROP TABLE IF EXISTS CONSUMOSORDENESPRODUCCION;
DROP TABLE IF EXISTS RECETAS;
DROP TABLE IF EXISTS INGREDIENTES;



-- Tabla SUCURSALES
CREATE TABLE IF NOT EXISTS SUCURSALES (
    idSucursal INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreSucursal TEXT NOT NULL UNIQUE,
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
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idCategoria) REFERENCES CATEGORIAS(idCategoria)
);

-- Tabla PRECIOS
CREATE TABLE IF NOT EXISTS PRECIOS (
    idPrecio INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    precioPorUnidad DECIMAL(10, 2) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE
);

-- Tabla CONFIGPRODUCCION
CREATE TABLE IF NOT EXISTS CONFIGPRODUCCION (
    idConfigProduccion INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL UNIQUE,
    unidadesPorBandeja DECIMAL(10, 2) NOT NULL,
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
    fechaCierre DATE NULL,
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
    fechaCreacion DATE NOT NULL,
    FOREIGN KEY (idOrdenProduccion) REFERENCES ORDENESPRODUCCION(idOrdenProduccion) ON DELETE CASCADE,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_productos_idCategoria ON PRODUCTOS(idCategoria);
CREATE INDEX idx_precios_idProducto ON PRECIOS(idProducto);
CREATE INDEX idx_usuarios_idRol ON USUARIOS(idRol);


--------tablas para control de materia prima--------
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
    unidadMedida TEXT NOT NULL, -- Unidad de medida (kg, gr, litros, etc.)
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