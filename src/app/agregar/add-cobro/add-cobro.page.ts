import { Component, OnInit, OnDestroy } from '@angular/core';
import { CuentaCobrar } from 'src/app/interfaces/interfaces';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { Router } from '@angular/router';
import { ToastController, MenuController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-add-cobro',
  templateUrl: './add-cobro.page.html',
  styleUrls: ['./add-cobro.page.scss'],
})
export class AddCobroPage implements OnInit, OnDestroy {

  cuentasCobrar: CuentaCobrar[] = [];
  tiempoToast = 1750;
  colorSeleccionado: any[] = undefined;
  load: any;
  colorLabel: string;

  cuentaCobrar = {
    nombre: undefined,
    monto: undefined,
    fechaInicio: undefined,
    fechaFin: undefined,
    descripcion: undefined
  };

  constructor(
    private dbLocalStorage: LocalStorageService,
    private dbSQLite: SqliteBDService,
    private router: Router,
    public toastController: ToastController,
    private menuCtrl: MenuController,
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

  ngOnDestroy() {
    this.menuCtrl.enable(true);
  }

  addCuentaCobrar() {

    this.presentLoading().then(() => {
      if (this.cuentaCobrar.nombre === '' || this.cuentaCobrar.nombre === undefined) {
        this.load.dismiss();
        return this.presentToast('El campo nombre no puede estar vacio', this.tiempoToast);
      } else {
        if (this.cuentaCobrar.monto === '' || this.cuentaCobrar.monto === undefined) {
          this.load.dismiss();
          return this.presentToast('El campo monto no puede estar vacio', this.tiempoToast);
        } else {
          if (this.cuentaCobrar.fechaInicio === '' || this.cuentaCobrar.fechaInicio === undefined) {
            this.load.dismiss();
            return this.presentToast('El campo fecha Inicio no puede estar vacio', this.tiempoToast);
          } else {
            if (this.cuentaCobrar.fechaInicio > this.cuentaCobrar.fechaFin) {
              this.load.dismiss();
              return this.presentToast('La fecha de inicio no puede ser mayor a la fecha fin', this.tiempoToast);
            } else {
              {
                // tslint:disable-next-line: max-line-length
                console.log(this.cuentaCobrar.nombre + '-' + this.cuentaCobrar.monto + '-' + this.cuentaCobrar.fechaInicio + '-' + this.cuentaCobrar.fechaFin + '-' + this.cuentaCobrar.descripcion);
                // tslint:disable-next-line: max-line-length
                this.dbSQLite.addCobro(this.cuentaCobrar.nombre, this.cuentaCobrar.monto, this.cuentaCobrar.fechaInicio, this.cuentaCobrar.fechaFin, this.cuentaCobrar.descripcion)
                  .then(_ => {
                    this.cuentaCobrar = {
                      nombre: undefined,
                      monto: undefined,
                      fechaInicio: undefined,
                      fechaFin: undefined,
                      descripcion: undefined
                    };
                    this.presentToast('La cuenta se a añadido exitosamente', this.tiempoToast);
                  });
                this.load.dismiss();
                this.router.navigate(['/home/cobrar']);
              }
            }
          }
        }
      }
    });

  }

  async presentLoading() {
    this.load = await this.loading.create({
      message: 'Agregando Cobro',
      keyboardClose: true,
      spinner: 'lines'
    });
    await this.load.present();
  }

}
