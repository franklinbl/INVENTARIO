import { Component, OnInit, OnDestroy } from '@angular/core';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, MenuController, LoadingController } from '@ionic/angular';
import { Abonos, CuentaPagar } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-ver-editar-pago',
  templateUrl: './ver-editar-pago.page.html',
  styleUrls: ['./ver-editar-pago.page.scss'],
})
export class VerEditarPagoPage implements OnInit, OnDestroy {

  idCuentaPagar: number;
  editar = true;

  abonos: Abonos[] = [];
  load: any;
  montoRestante = 0;
  montosAbonados = 0;

  colorSeleccionado: any = undefined;
  moneda: any = undefined;

  tiempoToast = 1750;

  public cuentaPagar: CuentaPagar = {
    id: 0,
    nombre: '',
    monto: 0,
    fechaFin: new Date('January 01, 2000'),
    descripcion: ''
  };

  constructor(
    private BDSQLite: SqliteBDService,
    private DBLocalStorage: LocalStorageService,
    private router: Router,
    private rutaActiva: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    private menuCtrl: MenuController,
    private loading: LoadingController
  ) {

    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.DBLocalStorage.getColor().subscribe(color => {
      console.log('COLOR', color);
      this.colorSeleccionado = color;
    });

    this.DBLocalStorage.getMoneda().then(moneda => {
      console.log('COLOR', moneda);
      this.moneda = moneda;
    });

    this.idCuentaPagar = this.rutaActiva.snapshot.params.id;
    console.log(this.idCuentaPagar);

    this.BDSQLite.loadAbonosCuenta(this.idCuentaPagar);

    this.BDSQLite.getPago(this.idCuentaPagar).then(data => {
      console.log(data);
      this.cuentaPagar = data;
      this.montoRestante = this.cuentaPagar.monto;
    });

    this.BDSQLite.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.BDSQLite.getAbonos().subscribe(abo => {
          console.log('ABO', abo);
          this.abonos = abo;
          this.montoRestantefuntion();
        });
      }
    });

    console.log(this.cuentaPagar);
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  montoRestantefuntion() {
    this.BDSQLite.getSumaAbonos(this.idCuentaPagar).then(data => {
      console.log('SUMA', data);
      this.montoRestante = 0;
      console.log('MONTO RESTANTE = 0', this.montoRestante);
      this.montoRestante = this.cuentaPagar.monto;
      console.log('MONTO RESTANTE = MONTO DE LA CUENTA', this.montoRestante);
      this.montosAbonados = data;
      this.montoRestante -= this.montosAbonados;
    });
  }

  async presentToast(mensaje, duracion) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  async eliminarCuenta() {
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
            this.BDSQLite.deletePago(this.idCuentaPagar);
            this.BDSQLite.deleteAbonos(this.idCuentaPagar);
            this.presentToast('Producto eliminado exitosamente', 2000);
            this.router.navigate(['/home/pagar']);
          }
        }
      ]
    });

    await alert.present();
  }

  editarProducto() {
    this.editar = false;
    console.log(this.editar);
  }

  cancelar() {
    this.editar = true;
    this.BDSQLite.getCobro(this.idCuentaPagar).then(data => {
      this.cuentaPagar = data;
    });
    console.log(this.editar);
  }

  actualizarCuenta() {

    this.presentLoading().then(() => {
      if (this.cuentaPagar.nombre === '' || this.cuentaPagar.nombre === undefined) {
        this.load.dismiss();
        return this.presentToast('El campo nombre no puede estar vacio', this.tiempoToast);
      } else {
        if (this.cuentaPagar.monto === null || this.cuentaPagar.monto === undefined) {
          this.load.dismiss();
          return this.presentToast('El campo monto no puede estar vacio', this.tiempoToast);
        } else {
          if (this.cuentaPagar.fechaFin === null || this.cuentaPagar.fechaFin === undefined) {
            this.load.dismiss();
            return this.presentToast('El campo fecha Fin no puede estar vacio', this.tiempoToast);
          } else {

            this.BDSQLite.updatePago(this.cuentaPagar);

            this.presentToast('Producto actualizado exitosamente', 1750);

            this.BDSQLite.getCobro(this.idCuentaPagar).then(data => {
              this.cuentaPagar = data;
            });

            this.load.dismiss();
            this.editar = true;
            this.montoRestantefuntion();
          }
        }
      }
    });

  }

  addAbono(cuentaId) {
    this.router.navigate(['/add-abono', cuentaId]);
  }

  async eliminarAbono(id) {
    const alert = await this.alertController.create({
      header: 'BORRAR',
      message: 'Esta seguro que desea borrar este Abono',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => { }
        }, {
          text: 'Si',
          handler: () => {
            this.BDSQLite.deleteAbono(id, this.cuentaPagar.id);
            this.presentToast('Producto eliminado exitosamente', 2000);
          }
        }
      ]
    });

    await alert.present();
  }

  verDetalleAbono(id) {
    this.router.navigate(['/ver-editar-abono', id]);
  }

  async presentLoading() {
    this.load = await this.loading.create({
      message: 'Actualizando Abono',
      keyboardClose: true,
      spinner: 'lines'
    });
    await this.load.present();
  }

}

