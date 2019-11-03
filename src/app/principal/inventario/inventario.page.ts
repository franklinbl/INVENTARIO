import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, MenuController } from '@ionic/angular';
import { ConfiguracionesPage } from 'src/app/configuraciones/configuraciones.page';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit, OnDestroy {

  colorSeleccionado: any;
  nombreEmpresa: any = undefined;

  constructor(
    private db: LocalStorageService,
    private menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.db.getColor().subscribe(color => {
      console.log('COLOR', color)
      this.colorSeleccionado = color
    })

    this.db.getNombreEmpresa().subscribe(nombre => {
      console.log('NOMBRE', nombre)
      this.nombreEmpresa = nombre
    })
  }

  ngOnDestroy() {
    console.log('inventario')
  }

  toggleMenu() {
    this.menuCtrl.toggle()
  }

}
