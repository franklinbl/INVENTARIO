import { Component, OnInit, OnDestroy } from '@angular/core';
import { Abonos } from 'src/app/interfaces/interfaces';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, NavController, MenuController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-ver-editar-abono',
  templateUrl: './ver-editar-abono.page.html',
  styleUrls: ['./ver-editar-abono.page.scss'],
})
export class VerEditarAbonoPage implements OnInit, OnDestroy {

  colorSeleccionado: any = undefined;

  idAbono: number;
  editar = true;
  load: any;

  montoRestante = 0;
  montosAbonados = 0;

  public abono: Abonos = {
    id: undefined,
    monto: undefined,
    fecha: new Date('January 01, 2000'),
    descripcion: undefined,
    idCuenta: undefined,
  };

  constructor(
    private dbSQLite: SqliteBDService,
    private dbLocalStorage: LocalStorageService,
    private router: Router,
    private rutaActiva: ActivatedRoute,
    public alertController: AlertController,
    public toastController: ToastController,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private loading: LoadingController) {

    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.idAbono = this.rutaActiva.snapshot.params.id;
    console.log(this.idAbono);

    this.dbSQLite.getAbono(this.idAbono).then(data => {
      console.log(data);
      this.abono = data;
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

  async eliminarAbono() {
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
            this.dbSQLite.deleteAbono(this.idAbono, this.abono.idCuenta);
            this.presentToast('Producto eliminado exitosamente', 2000);
            this.navCtrl.pop();
          }
        }
      ]
    });

    await alert.present();
  }

  editarAbono() {
    this.editar = false;
    console.log(this.editar);
  }

  cancelar() {
    this.editar = true;
    this.dbSQLite.getAbono(this.idAbono).then(data => {
      this.abono = data;
    });
    console.log(this.editar);
  }

  actualizarAbono() {

    this.presentLoading().then(() => {
      this.dbSQLite.updateAbono(this.abono, this.abono.idCuenta);

      this.presentToast('Producto actualizado exitosamente', 1750);

      this.dbSQLite.getAbono(this.idAbono).then(data => {
        this.abono = data;
      });

      this.editar = true;
      this.load.dismiss();
    });

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
