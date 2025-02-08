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
    nombrePanadero TEXT NOT NULL,
    fechaAProducir DATE NOT NULL,
    idUsuario INTEGER,
    estadoOrden TEXT NOT NULL CHECK(estadoOrden IN ('C', 'p')) DEFAULT 'C',
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
    FOREIGN KEY (idOrdenProduccion) REFERENCES ORDENESPRODUCCION(idOrdenProduccion) ON DELETE SET NULL,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_productos_idCategoria ON PRODUCTOS(idCategoria);
CREATE INDEX idx_precios_idProducto ON PRECIOS(idProducto);
CREATE INDEX idx_usuarios_idRol ON USUARIOS(idRol);

-- Insertar permisos
INSERT INTO PERMISOS (idPermiso, nombrePermiso, descripcionPermiso, rutaAcceso, fechaCreacion, estado) VALUES
(1, 'Dashboard', 'Visualización de gráficas estadísticas', '/dashboard', '2025-01-25', 'A'),
(2, 'Crear usuarios', 'Crear usuarios para ingreso al sistema', '/users/create', '2025-01-25', 'A'),
(3, 'Control de Roles', 'Crear roles para asignar al usuario', '/users/roles', '2025-01-25', 'A'),
(4, 'Gestión de productos', 'Ingresos, modificación y eliminación de productos', '/productos', '2025-01-25', 'A');

-- Crear Rol administrador por defecto
INSERT INTO ROLES (idRol, nombreRol, descripcionRol, fechaCreacion, estado) VALUES
(1, 'Admin', 'Administrador de todo el sistema', '2025-01-25', 'A');

-- Permisos del rol administrador
INSERT INTO ROLESPERMISOS (idRol, idPermiso) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4);

-- Crear usuario administrador
INSERT INTO USUARIOS (idUsuario, nombreUsuario, apellidoUsuario, usuario, contrasena, correoUsuario, idRol, estadoUsuario, fechaCreacion, estado) VALUES
(1, 'admin', '', 'admin', '$2b$10$Hc2gvMXzcEqWAghdz1MvluiJFBq3slluVrhq/1LCI7EZ7nmIy43NS', 'panaderiasangabrields@gmail.com', 1, 'A', '2025-01-25', 'A');

-- Creación de categorías para productos
INSERT INTO CATEGORIAS (nombreCategoria, descripcionCategoria, fechaCreacion) VALUES
('Panadería', 'Productos pan francés, pan dulce, pitufos, etc', '2025-01-31'),
('Repostería', 'Productos pasteles, pan de banano, etc', '2025-01-31');

-- Ingreso de productos
INSERT INTO PRODUCTOS (nombreProducto, idCategoria, fechaCreacion) VALUES
('Francés', 1, '2025-01-31');

-- Ingreso de precios
INSERT INTO PRECIOS (idProducto, cantidad, precio, precioPorUnidad, fechaInicio) VALUES
(1, 3, 1, 0.33, '2025-01-31');

-- Ingreso de configuración de cantidad de unidades por bandeja
INSERT INTO CONFIGPRODUCCION (idProducto, unidadesPorBandeja, fechaCreacion) VALUES
(1, 120, '2025-02-07');

-- Ingreso de sucursal
INSERT INTO SUCURSALES (nombreSucursal, direccionSucursal, municipioSucursal, departamentoSucursal, telefonoSucursal, correoSucursal, fechaCreacion) VALUES
('San Gabriel Dueñas', 'Calle Real zona 1', 'San Miguel Dueñas', 'Sacatepéquez', '78541245', 'sangabrielpanaderia@gmail.com', '2025-02-07');

insert into ordenesproduccion (idSucursal, nombrePanadero, fechaAProducir, idUsuario, fechaCreacion)
values (1, 'Angel Garcia', '2025-02-08', 1, '2025-02-07');

insert into DETALLESORDENESPRODUCCION (idOrdenProduccion, idProducto, cantidadBandejas, cantidadUnidades, fechaCreacion )
values (1, 1, 40, 120, '2025-02-07' );