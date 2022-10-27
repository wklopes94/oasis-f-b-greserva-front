import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabankaRoutingModule } from './tabanka-routing.module';
import { TabankaComponent } from './tabanka.component';


@NgModule({
  declarations: [
    TabankaComponent
  ],
  imports: [
    CommonModule,
    TabankaRoutingModule
  ]
})
export class TabankaModule { }
