import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { ConfiguracionesPageModule } from '../configuraciones/configuraciones.module';
import { ConfiguracionesPage } from '../configuraciones/configuraciones.page';



@NgModule({
  entryComponents: [
    ConfiguracionesPage
  ],
  declarations: [
    MenuComponent
  ],
  exports: [
    MenuComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ConfiguracionesPageModule
  ]
})
export class ComponentesModule { }
