import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  { path: 'add-producto', loadChildren: './agregar/add-producto/add-producto.module#AddProductoPageModule' },
  { path: 'add-cobro', loadChildren: './agregar/add-cobro/add-cobro.module#AddCobroPageModule' },
  { path: 'add-pago', loadChildren: './agregar/add-pago/add-pago.module#AddPagoPageModule' },
  { path: 'add-venta', loadChildren: './agregar/add-venta/add-venta.module#AddVentaPageModule' },
  { path: 'add-abono/:id', loadChildren: './agregar/add-abono/add-abono.module#AddAbonoPageModule' },
  // tslint:disable-next-line: max-line-length
  { path: 'ver-editar-producto/:id', loadChildren: './verEditar/ver-editar-producto/ver-editar-producto.module#VerEditarProductoPageModule' },
  { path: 'ver-editar-abono/:id', loadChildren: './verEditar/ver-editar-abono/ver-editar-abono.module#VerEditarAbonoPageModule' },
  { path: 'ver-editar-cobro/:id', loadChildren: './verEditar/ver-editar-cobro/ver-editar-cobro.module#VerEditarCobroPageModule' },
  { path: 'ver-editar-pago/:id', loadChildren: './verEditar/ver-editar-pago/ver-editar-pago.module#VerEditarPagoPageModule' },
  // tslint:disable-next-line: max-line-length
  { path: 'ver-editar-estadisticas', loadChildren: './verEditar/ver-editar-estadisticas/ver-editar-estadisticas.module#VerEditarEstadisticasPageModule' },  { path: 'estadisticas', loadChildren: './verEditar/estadisticas/estadisticas.module#EstadisticasPageModule' },





];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

