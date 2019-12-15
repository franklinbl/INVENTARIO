import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';
import { ConfiguracionesPage } from 'src/app/configuraciones/configuraciones.page';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  colorSeleccionado: any;

  constructor(
    private db: LocalStorageService,
    private modalCtrl: ModalController,
    private router: Router
  ) { }

  ngOnInit() {
    this.db.getColor().subscribe(color => {
      console.log('COLOR', color)
      this.colorSeleccionado = color
    })
  }

  async abrirConfiguraciones() {
    const modal = await this.modalCtrl.create({
      component: ConfiguracionesPage
    });

    await modal.present();
  }

  irEstadisticas() {
    this.router.navigate(['/estadisticas'])
  }

  addProducto() {
    this.router.navigate(['/add-producto'])
  }

  irVenta() {
    this.router.navigate(['/add-venta'])
  }

  addCuentaPagar() {
    this.router.navigate(['/add-pago'])
  }

  addCuentaCobrar() {
    this.router.navigate(['/add-cobro'])
  }

}
