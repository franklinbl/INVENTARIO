import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../servicios/local-storage.service';
import { ConfiguracionesPage } from '../configuraciones/configuraciones.page';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  colorSeleccionado: any;

  constructor(
    private modalCtrl: ModalController,
    private dbLS: LocalStorageService
  ) { }

  async abrirConfiguraciones() {
    const modal = await this.modalCtrl.create({
      component: ConfiguracionesPage
    });

    await modal.present();
  }

  ngOnInit() {

    this.dbLS.getPrimeraEntrada().then(data => {
      console.log('DATA PRIMERA VES', data)
      if (data == null) {

        this.abrirConfiguraciones()

        this.dbLS.getColor().subscribe(data => {
          console.log(data);
          this.colorSeleccionado = data;
        });
      }
    })
  }

}
