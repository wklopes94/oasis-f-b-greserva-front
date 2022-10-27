import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntidadesComponent } from './entidades.component';

const routes: Routes = [
  { path: '', component: EntidadesComponent },
  { path: 'reserva', loadChildren: () => import('./reserva/reserva.module').then(m => m.ReservaModule) },

  { path: 'cliente', loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule) },
  { path: 'hospede', loadChildren: () => import('./hospede/hospede.module').then(m => m.HospedeModule) },
  { path: 'particular', loadChildren: () => import('./particular/particular.module').then(m => m.ParticularModule) },
  { path: 'grupo', loadChildren: () => import('./grupo/grupo.module').then(m => m.GrupoModule) },

  { path: 'estado', loadChildren: () => import('./estado/estado.module').then(m => m.EstadoModule) },
  { path: 'restaurante', loadChildren: () => import('./restaurante/restaurante.module').then(m => m.RestauranteModule) },
  { path: 'seating', loadChildren: () => import('./seating/seating.module').then(m => m.SeatingModule) },
  { path: 'restaurante-seating', loadChildren: () => import('./restaurante-seating/restaurante-seating.module').then(m => m.RestauranteSeatingModule) },
  { path: 'extras', loadChildren: () => import('./extras/extras.module').then(m => m.ExtrasModule) },

  { path: 'reserva-has-extra', loadChildren: () => import('./reserva-has-extra/reserva-has-extra.module').then(m => m.ReservaHasExtraModule) },

  { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
  { path: 'pagamento', loadChildren: () => import('./pagamento/pagamento.module').then(m => m.PagamentoModule) },
  { path: 'utilizador', loadChildren: () => import('./utilizador/utilizador.module').then(m => m.UtilizadorModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntidadesRoutingModule { }
