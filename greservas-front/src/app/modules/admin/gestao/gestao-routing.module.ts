import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestaoComponent } from './gestao.component';


const routes: Routes = [

  { path: '', component: GestaoComponent ,
  children: [

    { path: 'entidades', loadChildren: () => import('../entidades/entidades.module').then(m => m.EntidadesModule) }

  ] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestaoRoutingModule { }
