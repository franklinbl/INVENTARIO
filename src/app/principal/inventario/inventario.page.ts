import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, MenuController, AlertController } from '@ionic/angular';
import { ConfiguracionesPage } from 'src/app/configuraciones/configuraciones.page';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { Producto } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit, OnDestroy {

  colorSeleccionado: any = undefined;
  nombreEmpresa: any = undefined;
  moneda: any = undefined;

  productos: Producto[] = [];
  textoBuscar = '';
  codigo = '';

  constructor(
    private DBLocalStorage: LocalStorageService,
    private DBSQLite: SqliteBDService,
    private menuCtrl: MenuController,
    private router: Router,
    private barcodeScanner: BarcodeScanner,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.DBLocalStorage.getColor().subscribe(color => {
      console.log('COLOR', color);
      this.colorSeleccionado = color;
    });

    this.DBLocalStorage.getMoneda().subscribe(moneda => {
      console.log('MONEDA', moneda);
      this.moneda = moneda;
    });

    this.DBLocalStorage.getNombreEmpresa().subscribe(nombre => {
      console.log('NOMBRE', nombre);
      this.nombreEmpresa = nombre;
    });

    this.DBSQLite.getDatabaseState().subscribe(rdy => {
      if (rdy) {

        this.DBSQLite.getProductos().subscribe(prod => {
          console.log(prod);
          this.productos = prod;
        });

      }
    });
  }

  async eliminar(id) {
    const alert = await this.alertController.create({
      header: 'BORRAR',
      message: 'Esta seguro que desea borrar este elemento',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Si',
          handler: () => {
            this.DBSQLite.deleteProducto(id);
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnDestroy() {
    console.log('inventario');
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  addProducto() {
    this.router.navigate(['/add-producto']);
  }

  addVenta() {
    this.router.navigate(['/add-venta']);
  }

  verDetalle(id) {
    this.router.navigate(['/ver-editar-producto', id]);
  }

  buscar(event) {
    console.log(event);
    this.textoBuscar = event.detail.value;
  }

  addBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.codigo = barcodeData.text;
      this.textoBuscar = barcodeData.text;
    }).catch(err => {
      console.log('Error', err);
    });
  }

}
