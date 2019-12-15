
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
                                     moneda TEXT, 
                                     stock INTEGER, 
                                     descripcion TEXT);

CREATE TABLE IF NOT EXISTS cobros(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                  nombre TEXT, 
                                  monto NUMERIC, 
                                  moneda TEXT, 
                                  fechaInicio DATE, 
                                  fechaFin DATE, 
                                  descripcion TEXT);

CREATE TABLE IF NOT EXISTS pagos(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                 nombre TEXT, 
                                 monto NUMERIC, 
                                 moneda TEXT, 
                                 fechaFin DATE, 
                                 descripcion TEXT);

CREATE TABLE IF NOT EXISTS abonos(id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                  monto NUMERIC, 
                                  moneda TEXT, 
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