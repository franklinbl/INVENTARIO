import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerEditarEstadisticasPage } from './ver-editar-estadisticas.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarEstadisticasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerEditarEstadisticasPage]
})
export class VerEditarEstadisticasPageModule {}
