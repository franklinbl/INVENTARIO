import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-venta',
  templateUrl: './add-venta.page.html',
  styleUrls: ['./add-venta.page.scss'],
})
export class AddVentaPage implements OnInit, OnDestroy {

  colorSeleccionado: any = undefined;
  load: any;

  colorLabel: string;

  ventasDelDia: any[] = [];
  productos = [];
  formularios = [];
  textoBuscar = '';
  codigo = '';
  dosTap = 0;
  indiceProducto = 0;
  ventaVerificada = false;

  producto = {

    id: 0,
    nombre: '',
    marca: '',
    precio: 0,
    codigo: '',
    moneda: '',
    stock: 0,
    descripcion: '',
    cantidad: undefined

  };

  constructor(
    private dbLocalStorage: LocalStorageService,
    private dbSQLite: SqliteBDService,
    private menuCtrl: MenuController,
    public toastController: ToastController,
    public alertController: AlertController,
    private loading: LoadingController
  ) {
    this.menuCtrl.enable(false);
  }

  async presentToast(mensaje, duracion) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  ngOnInit() {
    this.dbLocalStorage.getColor().subscribe(color => {
      this.colorSeleccionado = color;
    });

    this.dbLocalStorage.getTema().then(tema => {
      console.log('TEMA', tema);
      if (tema === true) {
        this.colorLabel = 'blancoUno';
      } else {
        this.colorLabel = 'negroUno';
      }
    });

    this.dbSQLite.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        this.dbSQLite.getProductos().subscribe(prod => {
          // console.log(prod)
          this.productos = prod;
        });

        this.dbSQLite.getVentasDelDia().subscribe(v => {
          console.log('VENTAS DEL DIA', v);
          this.ventasDelDia = v;
        });

      }
    });

    this.formularios.push(this.producto);
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  buscar(event) {
    // console.log(event);
    this.textoBuscar = event.detail.value;
  }

  addProductoVenta(producto) {
    this.dosTap += 1;
    let esta = false;
    // console.log(this.formularios)

    setTimeout(() => {
      if (this.dosTap === 1) {
        this.presentToast('Doble toque para agregar producto', 1000);
      }

      this.dosTap = 0;
    }, 500);

    if (this.dosTap === 2) {

      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.formularios.length; i++) {
        if (this.formularios[i].id === producto.id) {
          esta = true;
          console.log('ESTA TRUE', esta);
          return this.presentToast('El producto ya esta en la lista de agregar venta', 1000);
        } else {
          esta = false;
          console.log('ESTA false', esta);
        }
      }

      if (esta === false) {
        if (this.formularios[0].nombre === '') {
          this.formularios.pop();
          this.formularios.push(producto);
        } else {
          this.formularios.push(producto);
        }
      }
    }
  }

  vaciar(item) {

    // console.log('ITEM', item)
    // console.log('LENGTH', this.formularios.length)

    if (this.formularios.length > 1) {
      this.rmFormulario(item.id);
    } else {

      this.formularios.pop();
      this.formularios.push(this.producto);

    }
  }

  rmFormulario(id) {

    for (let i = 0; i < this.formularios.length; i++) {
      if (this.formularios[i].id === id) {
        this.formularios.splice(i, 1);
      }
    }

  }

  addVenta() {
    let indice = 1;

    this.presentLoading().then(() => {
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.formularios.length; i++) {
        if (this.formularios[i].cantidad === undefined || this.formularios[i].cantidad === '') {
          this.load.dismiss();
          return this.presentToast('El producto numero ' + indice + ' no tiene una cantidad especifica', 2000);
        } else {
          if (this.formularios[i].cantidad > this.formularios[i].stock) {
            this.load.dismiss();
            return this.presentToast('La cantidad vendida del producto ' + indice + ' no puede ser mayor a ' + this.formularios[i].stock + ' el cual es la cantidad en existencia de este producto', 2000);
          } else {

            if (indice === this.formularios.length) {
              this.ventaVerificada = true;
            }

            if (this.ventaVerificada === true) {
              const fecha = moment().format('YYYY-MM-DD');

              // tslint:disable-next-line: prefer-for-of
              for (let p = 0; p < this.formularios.length; p++) {
                const montoVenta = this.formularios[p].cantidad * this.formularios[p].precioVenta;

                this.dbSQLite.addVenta(this.formularios[p].cantidad, montoVenta, fecha, this.formularios[p].id);
                this.ajustarStock(this.formularios[p].id, this.formularios[p].cantidad, this.formularios[p].stock);
              }

              // tslint:disable-next-line: prefer-for-of
              for (let p = 0; p < this.formularios.length; p++) {
                this.formularios[p].cantidad = undefined;
              }

              this.formularios = [];
              this.formularios.push(this.producto);
            }
          }

          indice += 1;

        }
      }
      this.load.dismiss();
    });

  }

  async actualizarVenta(item) {

    this.dosTap = 0;

    const alert = await this.alertController.create({
      header: 'Actualizar!',
      inputs: [
        {
          name: 'cantidad',
          type: 'number',
          value: item.cantidad,
          placeholder: 'Cantidad'
        },
        {
          name: 'nombre',
          type: 'text',
          value: item.nombre,
          placeholder: 'Producto',
          disabled: true
        },
        {
          name: 'marca',
          type: 'text',
          value: item.marca,
          placeholder: 'Marca',
          disabled: true
        },
        {
          name: 'fecha',
          type: 'date',
          min: '2015-01-01',
          max: '2050-01-01'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {

            if (data.cantidad === undefined || data.cantidad === '') {
              return this.presentToast('El campo cantidad no puede estar vacio', 2500);
            } else {
              if (data.fecha === '' || data.fecha === undefined) {
                return this.presentToast('El campo fecha no puede estar vacio', 2500);
              } else {
                console.log('Confirm Ok');
                const fecha = moment(data.fecha).format('YYYY-MM-DD');


                this.dbSQLite.getProducto(item.idProducto).then(producto => {
                  const productoCompleto = producto;
                  let nuevoMontoVenta;
                  productoCompleto.stock += item.cantidad;

                  nuevoMontoVenta = productoCompleto.precioVenta * data.cantidad;

                  this.dbSQLite.updateVenta(item.idVenta, data.cantidad, nuevoMontoVenta, fecha);
                  this.ajustarStock(item.idProducto, productoCompleto.stock, data.cantidad);

                });
              }
            }
          }
        }
      ]
    });

    await alert.present();
  }

  dobleTap(item) {
    this.dosTap += 1;

    setTimeout(() => {
      if (this.dosTap === 1) {
        this.presentToast('Doble toque para actualizar item', 1000);
      }

      this.dosTap = 0;
    }, 500);

    if (this.dosTap === 2) {
      console.log('double tap');
      console.log(item);
      this.actualizarVenta(item);
    }
  }

  async eliminarVenta(item) {
    const alert = await this.alertController.create({
      header: 'BORRAR',
      message: 'Esta seguro que desea borrar este elemento',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Si',
          handler: () => {
            console.log(item.cantidad);
            this.dbSQLite.deleteVenta(item.idVenta);
            this.presentToast('La venta se elimino exitosamente', 2000);

            this.dbSQLite.getProducto(item.idProducto).then(producto => {
              const productoCompleto = producto;
              productoCompleto.stock += item.cantidad;
              this.dbSQLite.updateStockDelProducto(productoCompleto.stock, item.idProducto);

            });
          }
        }
      ]
    });

    await alert.present();
  }

  ajustarStock(id, cantidad, stockViejo) {
    let nuevoStock;
    if (stockViejo >= cantidad) {
      nuevoStock = stockViejo - cantidad;
    } else {
      nuevoStock = cantidad - stockViejo;
    }

    this.dbSQLite.updateStockDelProducto(nuevoStock, id);
  }

  async presentLoading() {
    this.load = await this.loading.create({
      message: 'Agregando venta',
      keyboardClose: true,
      spinner: 'lines'
    });
    await this.load.present();
  }

}
