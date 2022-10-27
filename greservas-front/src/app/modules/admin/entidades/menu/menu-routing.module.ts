import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './components/crud/listar/listar.component';
import { ApagarComponent } from './components/crud/apagar/apagar.component';
import { CriaralterarComponent } from './components/crud/criaralterar/criaralterar.component';
import { DetalheComponent } from './components/crud/detalhe/detalhe.component';
import { MenuComponent } from './menu.component';


const routes: Routes = [{ path: '', component: MenuComponent,
  children: [

      { path: 'listar', component: ListarComponent },

      { path: 'criar', component: CriaralterarComponent },

      { path: 'resume', component: MenuComponent },

      { path: ':id/ver', component: DetalheComponent },

      { path: ':id/editar', component: CriaralterarComponent },

      { path: ':id/apagar', component: ApagarComponent }
    ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
