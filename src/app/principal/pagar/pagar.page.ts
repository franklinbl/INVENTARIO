import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/servicios/local-storage.service';

@Component({
  selector: 'app-pagar',
  templateUrl: './pagar.page.html',
  styleUrls: ['./pagar.page.scss'],
})
export class PagarPage implements OnInit {

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
