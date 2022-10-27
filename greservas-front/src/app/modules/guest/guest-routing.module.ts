import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuestComponent } from './guest.component';

const routes: Routes = [{ path: '', component: GuestComponent }, { path: 'tabanka', loadChildren: () => import('./rt/tabanka/tabanka.module').then(m => m.TabankaModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
