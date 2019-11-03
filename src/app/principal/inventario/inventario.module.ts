import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InventarioPage } from './inventario.page';
import { ConfiguracionesPage } from 'src/app/configuraciones/configuraciones.page';
import { ConfiguracionesPageModule } from 'src/app/configuraciones/configuraciones.module';

const routes: Routes = [
  {
    path: '',
    component: InventarioPage
  }
];

@NgModule({
  entryComponents: [
    ConfiguracionesPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ConfiguracionesPageModule
  ],
  declarations: [InventarioPage]
})
export class InventarioPageModule { }
