import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: 'home',
    component: HomePage,
    children: [
      {
        path: 'cobrar',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../principal/cobrar/cobrar.module').then(m => m.CobrarPageModule)
          }
        ]
      },
      {
        path: 'inventario',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../principal/inventario/inventario.module').then(m => m.InventarioPageModule)
          }
        ]
      },
      {
        path: 'pagar',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../principal/pagar/pagar.module').then(m => m.PagarPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/home/inventario',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home/inventario',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
