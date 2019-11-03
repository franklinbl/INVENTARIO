import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';

@Component({
  selector: 'app-cobrar',
  templateUrl: './cobrar.page.html',
  styleUrls: ['./cobrar.page.scss'],
})
export class CobrarPage implements OnInit {

  colorSeleccionado: any;

  constructor(
    private db: LocalStorageService
  ) { }

  ngOnInit() {
    this.db.getColor().subscribe(data => {
      console.log(data);
      this.colorSeleccionado = data;
    })
  }

}
