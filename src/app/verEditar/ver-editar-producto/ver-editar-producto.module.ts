import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { VerEditarProductoPage } from './ver-editar-producto.page';

const routes: Routes = [
  {
    path: '',
    component: VerEditarProductoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [VerEditarProductoPage]
})
export class VerEditarProductoPageModule {}
