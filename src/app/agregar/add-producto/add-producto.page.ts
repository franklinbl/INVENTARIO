import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { MenuController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Producto } from 'src/app/interfaces/interfaces';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.page.html',
  styleUrls: ['./add-producto.page.scss'],
})
export class AddProductoPage implements OnInit, OnDestroy {

  colorSeleccionado: any = undefined;
  nombreEmpresa: any = undefined;
  moneda: any = undefined;

  productos: Producto[] = [];
  formularios = [];
  indiceProducto = 0;
  tiempoToast = 2000;
  productosVerificados = false;
  loading: any;

  constructor(
    private dbLocalStorage: LocalStorageService,
    private dbSQLite: SqliteBDService,
    private menuCtrl: MenuController,
    private router: Router,

    public toastController: ToastController,
    private barcodeScanner: BarcodeScanner,
    // public loadingCtrl: LoadingController
  ) { }

  async presentToast(mensaje: string, duracion: number) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  ngOnInit() {
    this.dbLocalStorage.getColor().subscribe(color => {
      console.log('COLOR', color);
      this.colorSeleccionado = color;
    });

    this.dbLocalStorage.getMoneda().then(moneda => {
      console.log('MONEDA', moneda);
      this.moneda = moneda;
    });

    this.dbLocalStorage.getNombreEmpresa().subscribe(nombre => {
      console.log('NOMBRE', nombre);
      this.nombreEmpresa = nombre;
    });

    this.addFormulario();
  }

  ngOnDestroy() {
    this.indiceProducto = 0;
    this.menuCtrl.enable(true);
  }

  addProducto() {
    let numeroProducto = 0;

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.formularios.length; i++) {
      numeroProducto += 1;

      if (this.formularios[i].nombre === '' || this.formularios[i].nombre === undefined) {
        return this.presentToast('El campo nombre del producto numero ' + numeroProducto + ' no puede estar vacio', this.tiempoToast);
      } else {
        if (this.formularios[i].marca === '' || this.formularios[i].marca === undefined) {
          return this.presentToast('El campo marca del producto numero ' + numeroProducto + ' no puede estar vacio', this.tiempoToast);
        } else {
          if (this.formularios[i].precioCompra === '' || this.formularios[i].precioCompra === undefined) {
            // tslint:disable-next-line: max-line-length
            return this.presentToast('El campo precio de compra del producto numero ' + numeroProducto + ' no puede estar vacio', this.tiempoToast);
          } else {
            if (this.formularios[i].precioVenta === '' || this.formularios[i].precioVenta === undefined) {
              // tslint:disable-next-line: max-line-length
              return this.presentToast('El campo precio de venta del producto numero ' + numeroProducto + ' no puede estar vacio', this.tiempoToast);
            } else {
              if (this.formularios[i].stock === '' || this.formularios[i].stock === undefined) {
                // tslint:disable-next-line: max-line-length
                return this.presentToast('El campo stock del producto numero ' + numeroProducto + ' no puede estar vacio', this.tiempoToast);
              } else {

                console.log('numeroProducto', numeroProducto);
                console.log('length', this.formularios.length);

                if (numeroProducto === this.formularios.length) {
                  this.productosVerificados = true;
                }

                if (this.productosVerificados === true) {

                  for (let i = 0; i < this.formularios.length; i++) {
                    if (this.formularios[i].codigo === '' || this.formularios[i].codigo === undefined || this.formularios[i].codigo == null) {
                      this.formularios[i].codigo = 0;
                    }
                  }

                  for (let p = 0; p < this.formularios.length; p++) {

                    this.dbSQLite.addProducto(this.formularios[p].codigo, this.formularios[p].nombre, this.formularios[p].marca, this.formularios[p].precioCompra, this.formularios[p].precioVenta, this.formularios[p].stock, this.formularios[p].descripcion)
                      .then(_ => {

                      });

                  }

                  if (this.indiceProducto === 1) {
                    this.presentToast('Producto añadido exitosamente', 1750);
                  } else {
                    this.presentToast('Productos añadidos exitosamente', 1750);
                  }

                  this.formularios = [];
                  this.indiceProducto = 0;
                  this.productosVerificados = false;
                  this.router.navigate(['/home']);
                }
              }
            }
          }
        }
      }
    }
  }


  addBarcode(posicion) {
    console.log(posicion);

    this.barcodeScanner.scan().then(barcodeData => {
      this.formularios[posicion].codigo = barcodeData.text;
    }).catch(err => {
      this.presentToast('Error al leer el codigo de barra', 1750);
      console.log('ERROR', err);
    });
  }

  addFormulario() {
    this.indiceProducto += 1;
    const producto = { i: this.indiceProducto };
    this.formularios.push(producto);
  }

  rmFormulario(id) {

    for (let i = 0; i < this.formularios.length; i++) {
      if (this.formularios[i].i === id) {
        this.formularios.splice(i, 1);
      }
    }

    this.indiceProducto -= 1;

  }

}
