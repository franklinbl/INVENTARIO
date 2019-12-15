import { Component, OnInit } from '@angular/core';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, MenuController } from '@ionic/angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { Producto } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-ver-editar-producto',
  templateUrl: './ver-editar-producto.page.html',
  styleUrls: ['./ver-editar-producto.page.scss'],
})
export class VerEditarProductoPage implements OnInit {

  colorSeleccionado: any = undefined;

  idProducto: number;
  editar = true;
  productoActualizar: Producto = {
    id: 0,
    codigo: '',
    nombre: '',
    marca: '',
    precioVenta: 0,
    precioCompra: 0,
    stock: 0,
    descripcion: ''
  };

  public producto: Producto = {
    id: 0,
    codigo: '',
    nombre: '',
    marca: '',
    precioVenta: 0,
    precioCompra: 0,
    stock: 0,
    descripcion: ''
  };

  constructor(
    private BDSQLite: SqliteBDService,
    private DBLocalStorage: LocalStorageService,
    private router: Router,
    private rutaActiva: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    private barcodeScanner: BarcodeScanner,
    private menuCtrl: MenuController) {

    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.DBLocalStorage.getColor().subscribe(color => {
      console.log('COLOR', color)
      this.colorSeleccionado = color
    })

    this.idProducto = this.rutaActiva.snapshot.params['id'];
    console.log(this.idProducto);

    this.BDSQLite.getProducto(this.idProducto).then(data => {
      console.log(data);
      this.producto = data;
    });

    console.log(this.producto);
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

  async eliminar() {
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
            this.BDSQLite.deleteProducto(this.idProducto)
            this.presentToast("Producto eliminado exitosamente", 2500)
            this.router.navigate(['/home'])
          }
        }
      ]
    });

    await alert.present();
  }

  editarProducto() {
    this.editar = false
    console.log(this.editar)
  }

  cancelar() {
    this.editar = true
    this.BDSQLite.getProducto(this.idProducto).then(data => {
      this.producto = data;
    });
    console.log(this.editar)
  }

  actualizar() {
    if (this.producto.nombre == '' || this.producto.nombre == undefined) {
      return this.presentToast("El campo nombre no puede estar vacio", 1750);
    } else {
      if (this.producto.marca == '' || this.producto.marca == undefined) {
        return this.presentToast("El campo marca no puede estar vacio", 1750);
      } else {
        if (this.producto.precioVenta == null || this.producto.precioVenta == undefined) {
          return this.presentToast("El campo precio venta no puede estar vacio", 1750);
        } else {
          if (this.producto.precioCompra == null || this.producto.precioCompra == undefined) {
            return this.presentToast("El campo moneda compra no puede estar vacio", 1750);
          } else {
            if (this.producto.stock == null || this.producto.stock == undefined) {
              return this.presentToast("El campo stock no puede estar vacio", 1750);
            } else {
              this.BDSQLite.updateProducto(this.producto);

              this.presentToast("Producto actualizado exitosamente", 1750);

              this.BDSQLite.getProducto(this.idProducto).then(data => {
                this.producto = data;
              });

              this.editar = true
            }
          }
        }
      }
    }
  }

  addBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.producto.codigo = barcodeData.text
    }).catch(err => {
      this.presentToast("Error al leer el codigo de barra", 1750);
    });
  }

}
