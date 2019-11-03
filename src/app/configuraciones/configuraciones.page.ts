import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { LocalStorageService } from '../servicios/local-storage.service';

@Component({
  selector: 'app-configuraciones',
  templateUrl: './configuraciones.page.html',
  styleUrls: ['./configuraciones.page.scss'],
})
export class ConfiguracionesPage implements OnInit {

  colorSeleccionado: any;
  nombreEmpresa: any = undefined;
  moneda: any = undefined;

  colores: string[] = [
    'azulUno',
    'azulDos',
    'azulTres',
    'verdeUno',
    'verdeDos',
    'amarilloUno',
    'rojoUno',
    'rojoDos',
    'rojoTres',
    'rosadoUno',
    'rosadoDos',
    'moradoUno',
    'moradoDos',
    'negroUno',
    'grisUno',
  ]

  constructor(
    private modalCtrl: ModalController,
    private dbLS: LocalStorageService,
    public toastController: ToastController
  ) { }

  async presentToast(mensaje, duracion) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duracion
    });
    toast.present();
  }

  ngOnInit() {
    this.dbLS.getNombreEmpresa().subscribe(data => {
      this.nombreEmpresa = data
    });

    this.dbLS.getMoneda().then(data => {
      console.log(data);
      this.moneda = data;
    })

    this.dbLS.getColor().subscribe(data => {
      console.log(data);
      this.colorSeleccionado = data;
    })
  }

  guardar() {

    if (this.moneda == undefined || this.moneda == '' || this.moneda == ' ') {
      return this.presentToast('Debes definir la moneda', 2000)
    } else {
      if (this.colorSeleccionado == undefined) {
        return this.presentToast('Debes seleccionar un color', 2000)
      } else {
        this.dbLS.addPrimeraEntrada(true).then(data => {
          console.log('DATA', data)
        })

        this.dbLS.addMoneda(this.moneda).then(data => {
          console.log('DATA', data)
        })

        this.dbLS.addNombreEmpresa(this.nombreEmpresa).then(data => {
          console.log('DATA', data)
        })

        this.modalCtrl.dismiss();
      }
    }
  }

  valorSeleccionado(item) {
    console.log('El color seleccionado es: ' + item)

    this.dbLS.addColor(item).then(data => {
      // console.log('DATA', data)
    })
  }

}
