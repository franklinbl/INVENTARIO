import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { MenuController, ToastController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { CuentaPagar } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-add-pago',
  templateUrl: './add-pago.page.html',
  styleUrls: ['./add-pago.page.scss'],
})
export class AddPagoPage implements OnInit, OnDestroy {

  colorSeleccionado: any = undefined;

  cuentasPagar: CuentaPagar[] = [];
  tiempoToast = 1750;
  load: any;
  colorLabel: string;

  cuentaPagar = {
    nombre: undefined,
    monto: undefined,
    fechaFin: undefined,
    descripcion: undefined
  };

  constructor(
    private dbLocalStorage: LocalStorageService,
    private dbSQLite: SqliteBDService,
    private menuCtrl: MenuController,
    private router: Router,
    public toastController: ToastController,
    private loading: LoadingController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.dbLocalStorage.getColor().subscribe(color => {
      console.log('COLOR', color);
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
  }

  async presentToast(mensaje, duracion) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  addcuentaPagar() {

    this.presentLoading().then(() => {

      if (this.cuentaPagar.nombre === '' || this.cuentaPagar.nombre === undefined) {
        this.load.dismiss();
        return this.presentToast('El campo nombre no puede estar vacio', this.tiempoToast);
      } else {
        if (this.cuentaPagar.monto === '' || this.cuentaPagar.monto === undefined) {
          this.load.dismiss();
          return this.presentToast('El campo monto no puede estar vacio', this.tiempoToast);
        } else {
          if (this.cuentaPagar.fechaFin === '' || this.cuentaPagar.fechaFin === undefined) {
            this.load.dismiss();
            return this.presentToast('El campo fecha Fin no puede estar vacio', this.tiempoToast);
          } else {
            // tslint:disable-next-line: max-line-length
            console.log(this.cuentaPagar.nombre + '-' + this.cuentaPagar.monto + '-' + this.cuentaPagar.fechaFin + '-' + this.cuentaPagar.descripcion);
            this.dbSQLite.addPago(this.cuentaPagar.nombre, this.cuentaPagar.monto, this.cuentaPagar.fechaFin, this.cuentaPagar.descripcion)
              .then(_ => {
                this.cuentaPagar = {
                  nombre: undefined,
                  monto: undefined,
                  fechaFin: undefined,
                  descripcion: undefined
                };
                this.presentToast('La cuenta se a añadido exitosamente', this.tiempoToast);
              });
            this.load.dismiss();
            this.router.navigate(['/home/pagar']);
          }
        }
      }
    });
  }

  async presentLoading() {
    this.load = await this.loading.create({
      message: 'Agregando Pago',
      keyboardClose: true,
      spinner: 'lines'
    });
    await this.load.present();
  }

}
