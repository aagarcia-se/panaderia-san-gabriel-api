-- Eliminar las tablas si existen
DROP TABLE IF EXISTS ROLESPERMISOS;
DROP TABLE IF EXISTS PERMISOS;
DROP TABLE IF EXISTS USUARIOS;
DROP TABLE IF EXISTS ROLES;
DROP TABLE IF EXISTS ACCESOS_USUARIOS;
DROP TABLE IF EXISTS SUCURSALES;
DROP TABLE IF EXISTS PRODUCTOSiMAGENES;
DROP TABLE IF EXISTS PRECIOS;
DROP TABLE IF EXISTS PRODUCTOS;
DROP TABLE IF EXISTS CATEGORIAS;

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
    fechaCreacion DATE  NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idRol) REFERENCES ROLES(idRol)
);

-- Tabla ACCESOS_USUARIOS (Información de acceso y seguridad)
CREATE TABLE IF NOT EXISTS ACCESOS_USUARIOS (
    idAcceso INTEGER PRIMARY KEY AUTOINCREMENT,
    idUsuario INTEGER NOT NULL,
    cambioContrasena BOOLEAN NOT NULL DEFAULT 0,
    ultimaConexion DATETIME,
    intentosFallidos INTEGER DEFAULT 0,
    tokenRecuperacion TEXT,
    fechaExpiracionToken DATETIME,
    fechaCreacion DATE  NOT NULL,
    FOREIGN KEY (idUsuario) REFERENCES USUARIOS(idUsuario) ON UPDATE CASCADE
);


-- Tabla ROLES
CREATE TABLE IF NOT EXISTS ROLES (
    idRol INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreRol TEXT NOT NULL UNIQUE,
    descripcionRol TEXT,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);


-- Tabla PERMISOS
CREATE TABLE IF NOT EXISTS PERMISOS (
    idPermiso INTEGER PRIMARY KEY AUTOINCREMENT,
    nombrePermiso TEXT NOT NULL UNIQUE,
    descripcionPermiso TEXT,
    rutaAcceso TEXT,
    fechaCreacion DATE  NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Tabla ROLESPERMISOS
CREATE TABLE IF NOT EXISTS ROLESPERMISOS (
    idRol INTEGER NOT NULL,
    idPermiso INTEGER NOT NULL,
    FOREIGN KEY (idRol) REFERENCES ROLES(idRol) ON DELETE CASCADE,
    FOREIGN KEY (idPermiso) REFERENCES PERMISOS(idPermiso) ON DELETE CASCADE
);

-- Tabla SUCURSALES
CREATE TABLE IF NOT EXISTS SUCURSALES (
    idSucursal INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreSucursal TEXT NOT NULL UNIQUE,
    direccionSucursal TEXT NOT NULL,
    municipioSucursal TEXT NOT NULL,
    departamentoSucursal TEXT NOT NULL,
    latitudSucursal TEXT NOT NULL,
    longitudSucursal TEXT NOT NULL,
    telefonoSucursal TEXT ,
    correoSucursal TEXT ,
    fechaCreacion DATE NOT NULL ,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

CREATE TABLE IF NOT EXISTS CATEGORIAS (
    idCategoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreCategoria TEXT NOT NULL UNIQUE,
    descripcionCategoria TEXT,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A'
);

-- Tabla Productos
CREATE TABLE IF NOT EXISTS PRODUCTOS (
    idProducto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombreProducto TEXT NOT NULL UNIQUE,
    idCategoria INTEGER NOT NULL,
    fechaCreacion DATE NOT NULL,
    estado TEXT NOT NULL CHECK(estado IN ('A', 'N')) DEFAULT 'A',
    FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria)
);


CREATE TABLE IF NOT EXISTS PRODUCTOSIMAGENES (
    idImagen INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL UNIQUE,
    imagenB64 TEXT NOT NULL CHECK (LENGTH(imagenB64) <= 1000000), -- Límite de 1MB en Base64
    fechaCreacion DATE NOT NULL, 
    estado TEXT NOT NULL DEFAULT 'A' CHECK (estado IN ('A', 'N')), 
    FOREIGN KEY (idProducto) REFERENCES Productos(idProducto) ON DELETE CASCADE
);

-- Tabla Precios
CREATE TABLE PRECIOS (
    idPrecio INTEGER PRIMARY KEY AUTOINCREMENT,
    idProducto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    precioPorUnidad DECIMAL(10, 2) NOT NULL,
    fechaInicio DATE NOT NULL,
    fechaFin DATE,
    FOREIGN KEY (idProducto) REFERENCES PRODUCTOS(idProducto) ON DELETE CASCADE
)


CREATE TRIGGER IF NOT EXISTS eliminar_producto_si_precio_eliminado
AFTER DELETE ON PRECIOS
FOR EACH ROW
BEGIN
    DELETE FROM PRODUCTOS WHERE idProducto = OLD.idProducto;
END;





/*-----------------------------------------------------------------------------------------
  -----------------------------------------------------------------------------------------*/
-- Tabla PedidosProduccion
CREATE TABLE IF NOT EXISTS PEDIDOSPRODUCCION (
    id_pedido INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER NOT NULL,
    cantidad_bandejas INTEGER NOT NULL,
    unidades_por_bandeja INTEGER NOT NULL,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATETIME,
    estado TEXT DEFAULT 'Pendiente',
    FOREIGN KEY (id_producto) REFERENCES Productos(id_producto)
);

-- Tabla VentasEstimadas
CREATE TABLE IF NOT EXISTS VENTAS (
    id_venta_estimada INTEGER PRIMARY KEY AUTOINCREMENT,
    id_pedido INTEGER NOT NULL,
    id_precio INTEGER NOT NULL,
    unidades_totales INTEGER NOT NULL,
    venta_estimada DECIMAL(10, 2) NOT NULL,
    fecha_calculo DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pedido) REFERENCES PedidosProduccion(id_pedido),
    FOREIGN KEY (id_precio) REFERENCES Precios(id_precio)
);

-- Insertar permisos ----
INSERT INTO permisos ("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") VALUES(1, 'Dashboard', 'Visualizacion de graficas estadisticas', '/dashboard', '2025-01-25', 'A');
INSERT INTO permisos ("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") VALUES(2, 'Crear usuarios', 'Crear usuarios para ingreso al sistema', '/users/create', '2025-01-25', 'A');
INSERT INTO permisos ("idPermiso", "nombrePermiso", "descripcionPermiso", "rutaAcceso", "fechaCreacion", "estado") VALUES(3, 'Control de Roles', 'Crear roles para asignar al usaurio', '/users/roles', '2025-01-25', 'A');

-- Crear Rol administrador por defecto--
INSERT INTO roles ("idRol", "nombreRol", "descripcionRol", "fechaCreacion", "estado") VALUES(1, 'Admin', 'Administrador de todo el sistema', '2025-01-25', 'A');

-- Permisos del rol administrador --
INSERT INTO rolespermisos ("idRol", "idPermiso") VALUES(1, 1);
INSERT INTO rolespermisos ("idRol", "idPermiso") VALUES(1, 3);
INSERT INTO rolespermisos ("idRol", "idPermiso") VALUES(1, 2);

-- Crear usuio administrador --
INSERT INTO usuarios ("idUsuario", "nombreUsuario", "apellidoUsuario", "usuario", "contrasena", "correoUsuario", "idRol", "estadoUsuario", "fechaCreacion", "estado") VALUES(1, 'admin', '', 'admin', '$2b$10$Hc2gvMXzcEqWAghdz1MvluiJFBq3slluVrhq/1LCI7EZ7nmIy43NS', 'panaderiasangabrields@gmail.com', 1, 'A', '2025-01-25', 'A');

--Creacion de categorias para productos
insert into categorias (nombreCategoria, descripcionCategoria, fechaCreacion)
values ('Panaderia', 'Productos pan frances, pan dulce, pitujos, etc', '2025-01-31');

insert into categorias (nombreCategoria, descripcionCategoria, fechaCreacion)
values ('Reposteria', 'Productos pasteles, pan de banano, etc', '2025-01-31');

--iNGRESO DE PRODUTOS
insert into productos (nombreProducto, idCategoria, fechaCreacion) values 
('Freances', 1, '2025-01-31');

--iNGRESO DE PRECIOS
insert into precios (idProducto, cantidad, precio, precioPorUnidad, fechaInicio)
values (1, 3, 1, 0.33, '20225-01-31');
