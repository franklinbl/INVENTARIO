
-- DROP TABLE productos;
-- DROP TABLE cobros;
-- DROP TABLE pagos;
-- DROP TABLE abonos;
-- DROP TABLE ventas;

CREATE TABLE IF NOT EXISTS productos(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                     codigo TEXT, 
                                     nombre TEXT, 
                                     marca TEXT, 
                                     precioCompra NUMERIC,
                                     precioVenta NUMERIC, 
                                     stock INTEGER, 
                                     descripcion TEXT);

CREATE TABLE IF NOT EXISTS cobros(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                  nombre TEXT, 
                                  monto NUMERIC, 
                                  fechaInicio DATE, 
                                  fechaFin DATE, 
                                  descripcion TEXT);

CREATE TABLE IF NOT EXISTS pagos(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                 nombre TEXT, 
                                 monto NUMERIC, 
                                 fechaFin DATE, 
                                 descripcion TEXT);

CREATE TABLE IF NOT EXISTS abonos(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                  monto NUMERIC, 
                                  fecha DATE, 
                                  descripcion TEXT, 
                                  idCuenta INTEGER);

CREATE TABLE IF NOT EXISTS ventas(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                  cantidad NUMERIC,
                                  montoVenta NUMERIC,
                                  monedaVenta TEXT,
                                  fecha DATE,
                                  idProducto NUMERIC,
                                  FOREIGN KEY(idProducto) REFERENCES productos(id));