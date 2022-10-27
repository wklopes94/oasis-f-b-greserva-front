import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabankaComponent } from './tabanka.component';

const routes: Routes = [{ path: '', component: TabankaComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabankaRoutingModule { }
