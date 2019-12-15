import { Component, OnInit, OnDestroy } from '@angular/core';
import { Producto } from 'src/app/interfaces/interfaces';
import { MenuController, ToastController } from '@ionic/angular';
import * as moment from 'moment';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
})
export class EstadisticasPage implements OnInit, OnDestroy {

  colorSeleccionado: any = undefined;

  ventas: any[] = [];
  ventasMontos: any[] = [];
  ventasProductoEspecifico: any[] = [];
  todosLosProducto: Producto[] = [];
  producto: Producto = undefined;
  fechaActual: any = moment().format('YYYY MMMM DD');
  fecha1: any = undefined;
  fecha2: any = undefined;
  fecha3: any = undefined;
  fecha4: any = undefined;
  rango1: any = undefined;
  rango2: any = undefined;
  montoTotalVentas: any = undefined;
  ventasMontosTotales = false;
  menu = true;
  ventasFecha = false;
  ventasDeUnProducto = false;
  seleccionProducto = false;
  VentasProductoBuscado = false;
  textoBuscar = '';
  dosTap = 0;

  constructor(
    private menuCtrl: MenuController,
    private dbSQLite: SqliteBDService,
    private dbLocalStorage: LocalStorageService,
    public toastController: ToastController,
  ) {

    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.dbSQLite.getProductos().subscribe(p => {
      this.todosLosProducto = p;
      console.log(this.todosLosProducto);
    });

    this.dbLocalStorage.getColor().subscribe(color => {
      this.colorSeleccionado = color;
    });
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  async presentToast(mensaje, duracion) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  buscar(event) {
    // console.log(event);
    this.textoBuscar = event.detail.value;
  }

  mostrarVentasFecha() {
    this.menu = false;
    this.ventasFecha = true;
  }

  mostrarMontosVendidos() {
    this.menu = false;
    this.ventasMontosTotales = true;
  }

  mostrarVentasUnProducto() {
    this.menu = false;
    this.seleccionProducto = true;
  }

  articuloSeleccionado() {
    this.ventasFecha = false;
  }

  dobleTap(item) {
    this.dosTap += 1;

    setTimeout(() => {
      if (this.dosTap === 1) {
        this.presentToast('Doble toque para seleccionar item', 1000);
      }

      this.dosTap = 0;
    }, 500);

    if (this.dosTap === 2) {
      console.log('double tap');
      this.producto = item;
      this.seleccionProducto = false;
      this.ventasDeUnProducto = true;
    }
  }

  volver() {
    this.menu = true;
    this.ventasFecha = false;
    this.ventasDeUnProducto = false;
    this.seleccionProducto = false;
    this.ventasMontosTotales = false;
    this.ventas = [];
    this.fecha1 = undefined;
    this.fecha2 = undefined;
    this.fecha3 = undefined;
    this.fecha4 = undefined;
    this.VentasProductoBuscado = undefined;
  }

  filtrarVentas() {

    if (this.fecha2 === undefined) {
      this.fecha2 = this.fecha1;
    }

    this.dbSQLite.loadVentasPorRango(moment(this.fecha1).format('YYYY-MM-DD'), moment(this.fecha2).format('YYYY-MM-DD')).then(data => {
      console.log('VENTAS', data);
      this.ventas = data;

      if (this.ventas.length === 0) {
        this.presentToast('No hay resultados para esta busqueda', 3000);
      }
    });

  }

  filtrarVentaIndivial() {

    if (this.fecha2 === undefined) {
      this.fecha2 = this.fecha1;
    }

    this.rango1 = this.fecha1;
    this.rango2 = this.fecha2;

    // tslint:disable-next-line: max-line-length
    this.dbSQLite.loadVentasPorRangoUnProducto(this.producto.id, moment(this.fecha1).format('YYYY-MM-DD'), moment(this.fecha2).format('YYYY-MM-DD'))
      .then(data => {
        console.log('VENTAS', data);
        this.ventasProductoEspecifico = data;
        this.VentasProductoBuscado = true;

        if (this.ventasProductoEspecifico.length === 0) {
          this.presentToast('No hay resultados para esta busqueda', 3000);
        }
      });

    this.fecha1 = undefined;
    this.fecha2 = undefined;
  }

  filtrarGanancias() {
    // tslint:disable-next-line: max-line-length
    // this.dbSQLite.getMontoTotalVentasBs(moment(this.fecha1).format('YYYY-MM-DD'), moment(this.fecha2).format('YYYY-MM-DD')).then(monto => {
    //   console.log('MONTOS', monto);
    //   this.montoBs = monto.montoVenta;
    // });

    // this.dbSQLite.getMontoTotalVentasDolar(moment(this.fecha1).format('YYYY-MM-DD'), moment(this.fecha2).format('YYYY-MM-DD'))
    //   .then(monto => {
    //     console.log('MONTOS', monto);
    //     this.montoDolar = monto.montoVenta;
    //   });

    this.dbSQLite.getMontoTotalVentasPrecioCompra(this.fecha3.format('YYYY-MM-DD'), this.fecha4.format('YYYY-MM-DD')).then(monto => {
      this.montoTotalVentas = monto;
    });
  }

}
