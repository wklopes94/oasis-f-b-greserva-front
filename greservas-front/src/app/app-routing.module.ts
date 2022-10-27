import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PaginaNaoEncontradoComponent } from './my-shared/modules/components-shared/pagina-nao-encontrado/pagina-nao-encontrado.component';

const routes: Routes = [


  { path: 'guest', loadChildren: () => import('./modules/guest/guest.module').then(m => m.GuestModule) },

  { path: 'oa-admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },



  {
    path: '',
    redirectTo: '/guest',
    pathMatch: 'full'
  },

  { path: '**',component: PaginaNaoEncontradoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
