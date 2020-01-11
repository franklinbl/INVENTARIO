import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { SqliteBDService } from 'src/app/servicios/sqlite-bd.service';
import { Router } from '@angular/router';
import { AlertController, MenuController } from '@ionic/angular';
import { CuentaPagar } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.page.html',
  styleUrls: ['./pagar.page.scss'],
})
export class PagarPage implements OnInit {

  colorSeleccionado: any;

  cuentasPagar: CuentaPagar[] = [];
  textoBuscar = '';

  moneda: any;

  constructor(
    private dbStorage: LocalStorageService,
    private BDLocalStorage: LocalStorageService,
    private BDSQLite: SqliteBDService,
    private router: Router,
    public alertController: AlertController,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.dbStorage.getColor().subscribe(data => {
      console.log(data);
      this.colorSeleccionado = data;
    });

    this.dbStorage.getMoneda().subscribe(data => {
      console.log(data);
      this.moneda = data;
    });

    this.BDSQLite.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.BDSQLite.getPagos().subscribe(cuentasCobrar => {
          this.cuentasPagar = cuentasCobrar;
        });
      }
    });
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
            this.BDSQLite.deletePago(id);
          }
        }
      ]
    });

    await alert.present();
  }

  toggleMenu() {
    this.menuCtrl.toggle();
  }

  addPago() {
    this.router.navigate(['/add-pago']);
  }

  verDetalle(id) {
    this.router.navigate(['/ver-editar-pago', id]);
  }

  buscar(event) {
    this.textoBuscar = event.detail.value;
  }

}
