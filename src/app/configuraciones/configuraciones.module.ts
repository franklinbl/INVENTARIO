import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule } from '@ionic/angular';

import { ConfiguracionesPage } from './configuraciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicStorageModule.forRoot()
  ],
  declarations: [ConfiguracionesPage]
})
export class ConfiguracionesPageModule {}
