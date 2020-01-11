import { Component, OnInit, OnDestroy } from '@angular/core';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, MenuController, LoadingController } from '@ionic/angular';
import { CuentaCobrar, Abonos } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-ver-editar-cobro',
  templateUrl: './ver-editar-cobro.page.html',
  styleUrls: ['./ver-editar-cobro.page.scss'],
})
export class VerEditarCobroPage implements OnInit, OnDestroy {

  idCuentaCobrar: number;
  editar = true;
  load: any;

  abonos: Abonos[] = [];

  montoRestante = 0;
  montosAbonados = 0;

  colorSeleccionado: any = undefined;
  moneda: any = undefined;
  colorLabel: string;

  tiempoToast = 1750;

  public cuentaCobrar: CuentaCobrar = {
    id: 0,
    nombre: '',
    monto: 0,
    fechaInicio: new Date('January 01, 2000'),
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
    private loading: LoadingController) {

    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.DBLocalStorage.getColor().subscribe(color => {
      console.log('COLOR', color);
      this.colorSeleccionado = color;
    });

    this.DBLocalStorage.getMoneda().subscribe(moneda => {
      console.log('COLOR', moneda);
      this.moneda = moneda;
    });

    this.DBLocalStorage.getTema().then(tema => {
      console.log('TEMA', tema);
      if (tema === true) {
        this.colorLabel = 'blancoUno';
      } else {
        this.colorLabel = 'negroUno';
      }
    });

    this.idCuentaCobrar = this.rutaActiva.snapshot.params.id;
    console.log(this.idCuentaCobrar);

    this.BDSQLite.loadAbonosCuenta(this.idCuentaCobrar);

    this.BDSQLite.getCobro(this.idCuentaCobrar).then(data => {
      console.log(data);
      this.cuentaCobrar = data;
      this.montoRestante = this.cuentaCobrar.monto;
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

    console.log(this.cuentaCobrar);
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  montoRestantefuntion() {
    this.BDSQLite.getSumaAbonos(this.idCuentaCobrar).then(data => {
      console.log('SUMA', data);
      this.montoRestante = 0;
      console.log('MONTO RESTANTE = 0', this.montoRestante);
      this.montoRestante = this.cuentaCobrar.monto;
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
            this.BDSQLite.deleteCobro(this.idCuentaCobrar);
            this.BDSQLite.deleteAbonos(this.idCuentaCobrar);
            this.presentToast('Producto eliminado exitosamente', 2000);
            this.router.navigate(['/home/cobrar']);
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
    this.BDSQLite.getCobro(this.idCuentaCobrar).then(data => {
      this.cuentaCobrar = data;
    });
    console.log(this.editar);
  }

  actualizarCuenta() {

    this.presentLoading().then(() => {
      if (this.cuentaCobrar.nombre === '' || this.cuentaCobrar.nombre === undefined) {
        this.load.dismiss();
        return this.presentToast('El campo nombre no puede estar vacio', this.tiempoToast);
      } else {
        if (this.cuentaCobrar.monto === null || this.cuentaCobrar.monto === undefined) {
          this.load.dismiss();
          return this.presentToast('El campo monto no puede estar vacio', this.tiempoToast);
        } else {
          if (this.cuentaCobrar.fechaInicio === null || this.cuentaCobrar.fechaInicio === undefined) {
            this.load.dismiss();
            return this.presentToast('El campo fecha Inicio no puede estar vacio', this.tiempoToast);
          } else {
            if (this.cuentaCobrar.fechaFin === null || this.cuentaCobrar.fechaFin === undefined) {
              this.load.dismiss();
              return this.presentToast('El campo fecha Fin no puede estar vacio', this.tiempoToast);
            } else {
              if (this.cuentaCobrar.fechaInicio > this.cuentaCobrar.fechaFin) {
                this.load.dismiss();
                return this.presentToast('La fecha de inicio no puede ser mayor a la fecha fin', this.tiempoToast);
              } else {
                this.BDSQLite.updateCobro(this.cuentaCobrar);

                this.presentToast('Producto actualizado exitosamente', 1750);

                this.BDSQLite.getCobro(this.idCuentaCobrar).then(data => {
                  this.cuentaCobrar = data;
                });

                this.load.dismiss();
                this.editar = true;
                this.montoRestantefuntion();
              }
            }
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
            this.BDSQLite.deleteAbono(id, this.cuentaCobrar.id);
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
      message: 'Actualizando Cobro',
      keyboardClose: true,
      spinner: 'lines'
    });
    await this.load.present();
  }

}
