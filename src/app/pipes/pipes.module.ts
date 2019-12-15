import { NgModule } from '@angular/core';
import { FiltroProductoPipe } from './filtro-producto.pipe';
import { FiltroCuentasPipe } from './filtro-cuentas.pipe';

@NgModule({
  declarations: [
    FiltroProductoPipe,
    FiltroCuentasPipe
  ],

  exports: [
    FiltroProductoPipe,
    FiltroCuentasPipe
  ]
})
export class PipesModule { }
