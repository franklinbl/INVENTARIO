import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerEditarCobroPage } from './ver-editar-cobro.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarCobroPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerEditarCobroPage]
})
export class VerEditarCobroPageModule {}
