import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { CuentaCobrar } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-cobrar',
  templateUrl: './cobrar.page.html',
  styleUrls: ['./cobrar.page.scss'],
})
export class CobrarPage implements OnInit {

  colorSeleccionado: any;

  cuentasCobrar: CuentaCobrar[] = [];
  textoBuscar = '';

  moneda: any;

  constructor(
    private BDLocalStorage: LocalStorageService,
    private BDSQLite: SqliteBDService,
    private router: Router,
    public alertController: AlertController,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.BDSQLite.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.BDSQLite.getCobros().subscribe(cuentasCobrar => {
          this.cuentasCobrar = cuentasCobrar;
        });
      }
    });

    this.BDLocalStorage.getMoneda().subscribe(data => {
      console.log(data);
      this.moneda = data;
    });

    this.BDLocalStorage.getColor().subscribe(data => {
      console.log(data);
      this.colorSeleccionado = data;
    });
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  async eliminarCobro(id) {
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
            this.BDSQLite.deleteCobro(id);
          }
        }
      ]
    });

    await alert.present();
  }

  addCobro() {
    this.router.navigate(['/add-cobro']);
  }

  verDetalle(id) {
    this.router.navigate(['/ver-editar-cobro', id]);
  }

  buscar(event) {
    this.textoBuscar = event.detail.value;
  }

}
