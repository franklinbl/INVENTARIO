import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(true);

  color = new BehaviorSubject([]);
  nombreEmpresa = new BehaviorSubject([]);
  moneda = new BehaviorSubject([]);

  constructor(
    private storage: Storage
  ) {
    this.loadColor();
    this.loadNombreEmpresa();
    this.loadMoneda();
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }




  getColor(): Observable<any[]> {
    return this.color.asObservable();
  }

  addColor(color) {
    return this.storage.set('color', color).then(data => {
      console.log('DATA', data);
      this.loadColor();
    });
  }

  loadColor() {
    return this.storage.get('color').then(data => {
      this.color.next(data);
    });
  }



  getNombreEmpresa(): Observable<any[]> {
    return this.nombreEmpresa.asObservable();
  }

  addNombreEmpresa(nombreEmpresa) {
    return this.storage.set('nombreEmpresa', nombreEmpresa).then(data => {
      console.log('DATA', data);
      this.loadNombreEmpresa();
    });
  }

  loadNombreEmpresa() {
    return this.storage.get('nombreEmpresa').then(data => {
      this.nombreEmpresa.next(data);
    });
  }



  addPrimeraEntrada(primeraentrada) {
    return this.storage.set('primeraentrada', primeraentrada).then(data => {
      console.log('DATA', data);
    });
  }

  getPrimeraEntrada() {
    return this.storage.get('primeraentrada').then(data => {
      return data;
    });
  }



  getMoneda(): Observable<any[]> {
    return this.moneda.asObservable();
  }

  addMoneda(moneda) {
    return this.storage.set('moneda', moneda).then(data => {
      console.log('DATA', data);
      this.loadMoneda();
    });
  }

  loadMoneda() {
    return this.storage.get('moneda').then(data => {
      this.moneda.next(data);
    });
  }



  addTema(tema) {
    return this.storage.set('tema', tema).then(data => {
      console.log('DATA', data);
    });
  }

  getTema() {
    return this.storage.get('tema').then(data => {
      return data;
    });
  }
}
