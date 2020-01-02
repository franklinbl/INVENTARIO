import { Platform, LoadingController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto, CuentaCobrar, CuentaPagar, Abonos, Ventas } from '../interfaces/interfaces';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class SqliteBDService {

  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  load: any;

  productos = new BehaviorSubject([]);
  cobros = new BehaviorSubject([]);
  pagos = new BehaviorSubject([]);
  abonos = new BehaviorSubject([]);
  dolares = new BehaviorSubject([]);
  DolarActual = new BehaviorSubject([]);
  ventasDelDia = new BehaviorSubject([]);

  constructor(
    private plt: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient,
    private loading: LoadingController
  ) {

    this.presentLoading().then(() => {
      this.plt.ready().then(() => {
        this.sqlite.create({
          name: 'inventario.db',
          location: 'default'
        })
          .then((db: SQLiteObject) => {
            this.database = db;
            this.seedDatabase();
          });
      });
      this.loading.dismiss();
    });

  }

  async presentLoading() {
    this.load = await this.loading.create({
      message: 'Cargando Datos',
      keyboardClose: true,
      spinner: 'bubbles'
    });
    await this.load.present();
  }

  seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadProductos();
            this.loadCobros();
            this.loadPagos();
            this.loadAbonos();
            this.loadVentasDelDia(moment().format('YYYY-MM-DD'));
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }





  // METODOS PARA PRODUCTOS

  getProductos(): Observable<Producto[]> {
    return this.productos.asObservable();
  }

  loadProductos() {
    return this.database.executeSql('SELECT * FROM productos ORDER BY marca ASC', []).then(data => {
      const productos: Producto[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          productos.push({

            id: data.rows.item(i).id,
            codigo: data.rows.item(i).codigo,
            nombre: data.rows.item(i).nombre,
            marca: data.rows.item(i).marca,
            precioCompra: data.rows.item(i).precioCompra,
            precioVenta: data.rows.item(i).precioVenta,
            stock: data.rows.item(i).stock,
            descripcion: data.rows.item(i).descripcion

          });
        }
      }
      this.productos.next(productos);
    });
  }

  addProducto(codigo, nombre, marca, precioCompra, precioVenta, stock, descripcion) {
    const data = [codigo, nombre, marca, precioCompra, precioVenta, stock, descripcion];
    console.log('LOG AGREGANDO PRODUCTOS (LOG SERVICES)', data);
    return this.database.executeSql
      ('INSERT INTO productos (codigo, nombre, marca, precioCompra, precioVenta, stock, descripcion) VALUES (?, ?, ?, ?, ?, ?, ?)', data)
      .then(() => {
        this.loadProductos();
      });
  }

  getProducto(id): Promise<Producto> {
    return this.database.executeSql('SELECT * FROM productos WHERE id = ? ', [id]).then(data => {

      return {

        id: data.rows.item(0).id,
        codigo: data.rows.item(0).codigo,
        nombre: data.rows.item(0).nombre,
        marca: data.rows.item(0).marca,
        precioCompra: data.rows.item(0).precioCompra,
        precioVenta: data.rows.item(0).precioVenta,
        stock: data.rows.item(0).stock,
        descripcion: data.rows.item(0).descripcion

      };

    });
  }

  deleteProducto(id) {
    return this.database.executeSql('DELETE FROM productos WHERE id = ?', [id]).then(_ => {
      this.loadProductos();
    });
  }

  updateProducto(p: Producto) {
    const data = [p.codigo, p.nombre, p.marca, p.precioCompra, p.precioVenta, p.stock, p.descripcion];
    return this.database.executeSql
      ('UPDATE productos SET codigo = ?, nombre = ?, marca = ?, precioCompra = ?, precioVenta = ?, stock = ?, descripcion = ? WHERE id = ' + p.id, data)
      .then(data => {
        this.loadProductos();
        console.log(data);
      });
  }

  updateStockDelProducto(cantidad, id) {
    const data = [cantidad, id];
    return this.database.executeSql('UPDATE productos SET stock = ? WHERE id = ?', data).then(data => {
      this.loadProductos();
      console.log(data);
    });
  }




  // METODOS PARA COBROS

  getCobros(): Observable<CuentaCobrar[]> {
    return this.cobros.asObservable();
  }

  loadCobros() {
    return this.database.executeSql('SELECT * FROM cobros', []).then(data => {
      const cobros: CuentaCobrar[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          cobros.push({

            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre,
            monto: data.rows.item(i).monto,
            fechaInicio: data.rows.item(i).fechaInicio,
            fechaFin: data.rows.item(i).fechaFin,
            descripcion: data.rows.item(i).descripcion

          });
        }
      }
      this.cobros.next(cobros);
    });
  }

  addCobro(nombre, monto, fechaInicio, fechaFin, descripcion) {
    const data = [nombre, monto, fechaInicio, fechaFin, descripcion];
    console.log('LOG AGREGANDO PRODUCTOS (LOG SERVICES)', data);
    return this.database.executeSql
      ('INSERT INTO cobros (nombre, monto, fechaInicio, fechaFin, descripcion) VALUES (?, ?, ?, ?, ?)', data)
      .then(data => {
        console.log(data);
        this.loadCobros();
      });
  }

  getCobro(id): Promise<CuentaCobrar> {
    console.log('ID', id);
    return this.database.executeSql('SELECT * FROM cobros WHERE id = ?', [id]).then(data => {
      console.log('DATA', data);
      return {

        id: data.rows.item(0).id,
        nombre: data.rows.item(0).nombre,
        monto: data.rows.item(0).monto,
        fechaInicio: data.rows.item(0).fechaInicio,
        fechaFin: data.rows.item(0).fechaFin,
        descripcion: data.rows.item(0).descripcion

      };

    });
  }

  deleteCobro(id) {
    return this.database.executeSql('DELETE FROM cobros WHERE id = ?', [id]).then(_ => {
      this.loadCobros();
    });
  }

  updateCobro(c: CuentaCobrar) {
    const data = [c.nombre, c.monto, c.fechaInicio, c.fechaFin, c.descripcion];
    return this.database.executeSql
      ('UPDATE cobros SET nombre = ?, monto = ?, fechaInicio = ?, fechaFin = ?, descripcion = ? WHERE id = ' + c.id, data)
      .then(data => {
        this.loadCobros();
        console.log(data);
      });
  }





  // METODOS PARA PAGOS

  getPagos(): Observable<CuentaPagar[]> {
    return this.pagos.asObservable();
  }

  loadPagos() {
    return this.database.executeSql('SELECT * FROM pagos', []).then(data => {
      const pagos: CuentaPagar[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          pagos.push({

            id: data.rows.item(i).id,
            nombre: data.rows.item(i).nombre,
            monto: data.rows.item(i).monto,
            fechaFin: data.rows.item(i).fechaFin,
            descripcion: data.rows.item(i).descripcion

          });
        }
      }
      this.pagos.next(pagos);
    });
  }

  addPago(nombre, monto, fechaFin, descripcion) {
    const data = [nombre, monto, fechaFin, descripcion];
    console.log('LOG AGREGANDO PRODUCTOS (LOG SERVICES)', data);
    return this.database.executeSql('INSERT INTO pagos (nombre, monto, fechaFin, descripcion) VALUES ( ?, ?, ?, ?)', data).then(data => {
      console.log(data);
      this.loadPagos();
    });
  }

  getPago(id): Promise<CuentaPagar> {
    return this.database.executeSql('SELECT * FROM pagos WHERE id = ?', [id]).then(data => {

      return {

        id: data.rows.item(0).id,
        nombre: data.rows.item(0).nombre,
        monto: data.rows.item(0).monto,
        fechaFin: data.rows.item(0).fechaFin,
        descripcion: data.rows.item(0).descripcion

      };

    });
  }

  deletePago(id) {
    return this.database.executeSql('DELETE FROM pagos WHERE id = ?', [id]).then(_ => {
      this.loadPagos();
    });
  }

  updatePago(p: CuentaPagar) {
    const data = [p.nombre, p.monto, p.fechaFin, p.descripcion];
    return this.database.executeSql
      ('UPDATE pagos SET nombre = ?, monto = ?, fechaFin = ?, descripcion = ? WHERE id = ' + p.id, data)
      .then(data => {
        this.loadPagos();
        console.log(data);
      });
  }




  // METODOS PARA LOS ABONOS

  getAbonos(): Observable<Abonos[]> {
    return this.abonos.asObservable();
  }

  loadAbonos() {
    return this.database.executeSql('SELECT * FROM abonos', []).then(data => {
      const abonos: Abonos[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          abonos.push({

            id: data.rows.item(i).id,
            monto: data.rows.item(i).monto,
            fecha: data.rows.item(i).fecha,
            descripcion: data.rows.item(i).descripcion,
            idCuenta: data.rows.item(i).idCuenta

          });
        }
      }
      this.abonos.next(abonos);
    });
  }

  loadAbonosCuenta(idCuenta) {
    return this.database.executeSql('SELECT * FROM abonos WHERE idCuenta = ?', [idCuenta]).then(data => {
      const abonos: Abonos[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          abonos.push({

            id: data.rows.item(i).id,
            monto: data.rows.item(i).monto,
            fecha: data.rows.item(i).fecha,
            descripcion: data.rows.item(i).descripcion,
            idCuenta: data.rows.item(i).idCuenta

          });
        }
      }
      this.abonos.next(abonos);
    });
  }

  addAbono(monto, fecha, descripcion, idCuenta) {
    const data = [monto, fecha, descripcion, idCuenta];
    console.log('LOG AGREGANDO PRODUCTOS (LOG SERVICES)', data);
    return this.database.executeSql('INSERT INTO abonos (monto, fecha, descripcion, idCuenta) VALUES (?, ?, ?, ?)', data).then(data => {
      this.loadAbonosCuenta(idCuenta);
    });
  }

  getAbono(id): Promise<Abonos> {
    return this.database.executeSql('SELECT * FROM abonos WHERE id = ?', [id]).then(data => {

      return {

        id: data.rows.item(0).id,
        monto: data.rows.item(0).monto,
        fecha: data.rows.item(0).fecha,
        descripcion: data.rows.item(0).descripcion,
        idCuenta: data.rows.item(0).idCuenta

      };
    });
  }

  deleteAbono(id, idCuenta) {
    return this.database.executeSql('DELETE FROM abonos WHERE id = ?', [id]).then(_ => {
      this.loadAbonosCuenta(idCuenta);
    });
  }

  deleteAbonos(idCuenta) {
    return this.database.executeSql('DELETE FROM abonos WHERE idCuenta = ?', [idCuenta]).then(_ => {
      this.loadAbonosCuenta(idCuenta);
    });
  }

  updateAbono(a: Abonos, idCuenta) {
    const data = [a.monto, a.fecha, a.descripcion];
    return this.database.executeSql('UPDATE abonos SET monto = ?, fecha = ?, descripcion = ? WHERE id = ' + a.id, data).then(data => {
      this.loadAbonosCuenta(idCuenta);
      console.log(data);
    });
  }

  getSumaAbonos(idCuenta): Promise<any> {
    return this.database.executeSql('SELECT monto FROM abonos WHERE idCuenta = ?', [idCuenta]).then(data => {

      let monto: any = 0;

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          monto += data.rows.item(i).monto;
        }
        return monto;

      } else {
        return monto;
      }
    });
  }




  // METODOS PARA LOS VENTAS

  getVentasDelDia(): Observable<Ventas[]> {
    return this.ventasDelDia.asObservable();
  }

  loadVentas() {
    return this.database.executeSql('SELECT * FROM ventas', []).then(data => {
      const ventas: Ventas[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {

          ventas.push({

            id: data.rows.item(i).id,
            cantidad: data.rows.item(i).cantidad,
            montoVenta: data.rows.item(i).montoVenta,
            fecha: data.rows.item(i).fecha,
            idProducto: data.rows.item(i).idProducto

          });
        }
      }
      return ventas;
    });
  }

  addVenta(cantidad, montoVenta, fecha, idProducto) {
    const data = [cantidad, montoVenta, fecha, idProducto];
    console.log('LOG AGREGANDO VENTAS (LOG SERVICES)', data);
    return this.database.executeSql
      ('INSERT INTO ventas (cantidad, montoVenta, fecha, idProducto) VALUES ( ?, ?, ?, ?)', data)
      .then(data => {
        console.log(data);
        this.loadVentasDelDia(fecha);
      });

  }

  deleteVenta(id) {
    return this.database.executeSql('DELETE FROM ventas WHERE id = ?', [id]).then(_ => {
      this.loadVentasDelDia(moment().format('YYYY-MM-DD'));
    });
  }

  updateVenta(id, cantidad, montoVenta, fecha) {
    const data = [cantidad, montoVenta, fecha];
    return this.database.executeSql('UPDATE ventas SET cantidad = ?, montoVenta = ?, fecha = ? WHERE id = ' + id, data).then(data => {
      this.loadVentasDelDia(moment().format('YYYY-MM-DD'));
      console.log(data);
    });
  }

  loadVentasDelDia(fecha) {

    return this.database.executeSql(

      'SELECT ventas.id AS idVenta, ventas.cantidad AS cantidad, ventas.montoVenta AS montoVenta, ventas.fecha AS fecha, ' +
      'productos.id AS idProducto, productos.nombre AS nombre, productos.marca AS marca ' +
      'FROM ventas ' +
      'JOIN productos ON ventas.idProducto = productos.id ' +
      'WHERE fecha = ?', [fecha]).then(data => {

        const ventas: any[] = [];

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {

            ventas.push({


              idVenta: data.rows.item(i).idVenta,
              cantidad: data.rows.item(i).cantidad,
              montoVenta: data.rows.item(i).montoVenta,
              fecha: data.rows.item(i).fecha,
              idProducto: data.rows.item(i).idProducto,
              nombre: data.rows.item(i).nombre,
              marca: data.rows.item(i).marca,

            });
          }
        }
        this.ventasDelDia.next(ventas);
      });
  }

  loadVentasPorRango(f1, f2) {

    return this.database.executeSql(
      'SELECT ventas.id AS idVenta, ventas.cantidad AS cantidad, ventas.fecha AS fecha, ' +
      'productos.nombre AS nombre, productos.marca AS marca ' +
      'FROM ventas ' +
      'JOIN productos ON ventas.idProducto = productos.id ' +
      'WHERE fecha BETWEEN \'' + f1 + '\' AND \'' + f2 + '\'', []).then(data => {

        const ventas: any[] = [];
        console.log('DATA QUERY', data);

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {

            ventas.push({

              idVenta: data.rows.item(i).idVenta,
              cantidad: data.rows.item(i).cantidad,
              fecha: data.rows.item(i).fecha,
              nombre: data.rows.item(i).nombre,
              marca: data.rows.item(i).marca,

            });
          }
        }
        return ventas;
      });
  }

  loadVentasPorRangoUnProducto(id, f1, f2) {

    console.log('DATOS', id + '---' + f1 + '---' + f2);

    return this.database.executeSql(
      'SELECT ventas.id AS idVenta, ventas.cantidad AS cantidad, ventas.fecha AS fecha, ' +
      'productos.id AS idProducto ,productos.nombre AS nombre, productos.marca AS marca ' +
      'FROM ventas ' +
      'JOIN productos ON ventas.idProducto = productos.id ' +
      'WHERE productos.id = ' + id + ' AND fecha BETWEEN \'' + f1 + '\' AND \'' + f2 + '\'', []).then(data => {

        const ventas: any[] = [];
        console.log('DATA QUERY', data);

        if (data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {

            ventas.push({

              idVenta: data.rows.item(i).idVenta,
              cantidad: data.rows.item(i).cantidad,
              fecha: data.rows.item(i).fecha,
              idProducto: data.rows.item(i).idProducto,
              nombre: data.rows.item(i).nombre,
              marca: data.rows.item(i).marca,

            });
          }
        }
        return ventas;
      });
  }

  getMontoTotalVentasPrecioCompra(f1, f2) {

    return this.database.executeSql(
      "SELECT SUM(montoVenta) as montoCompra " +
      "FROM ventas " +
      "WHERE fecha BETWEEN '" + f1 + "' AND '" + f2 + "'", []).then(data => {
        console.log(data);

        return {
          montoVenta: data.rows.item(0).montoVenta
        };
      });
  }

  // getMontoTotalVentasPrecioVenta(f1, f2) {

  //   return this.database.executeSql(
  //     "SELECT SUM(montoVenta) AS montoVenta, productos.moneda AS moneda " +
  //     "FROM ventas " +
  //     "JOIN productos ON ventas.idProducto = productos.id " +
  //     "WHERE moneda = '$' AND fecha BETWEEN '" + f1 + "' AND '" + f2 + "'", []).then(data => {
  //       console.log(data)

  //       return {
  //         montoVenta: data.rows.item(0).montoVenta
  //       }
  //     });
  // }



}
