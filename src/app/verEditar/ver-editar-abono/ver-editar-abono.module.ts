import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerEditarAbonoPage } from './ver-editar-abono.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarAbonoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerEditarAbonoPage]
})
export class VerEditarAbonoPageModule {}
