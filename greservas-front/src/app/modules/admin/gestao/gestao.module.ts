import { NgModule } from '@angular/core';
import { WebSharedModule } from '../../../my-shared/modules/web-shared/web-shared.module';
import { MaterialSharedModule } from '../../../my-shared/modules/material-shared/material-shared.module';


import { GestaoRoutingModule } from './gestao-routing.module';
import { GestaoComponent } from './gestao.component';

@NgModule({
  declarations: [
    GestaoComponent
  ],
  imports: [
    WebSharedModule,
    MaterialSharedModule,
    GestaoRoutingModule
  ]
})
export class GestaoModule { }
